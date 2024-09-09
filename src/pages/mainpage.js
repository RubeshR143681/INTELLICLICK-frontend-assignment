import React, { useEffect, useState, useRef, useCallback } from "react";
import { Table, Input, Spin, Dropdown, Menu, Checkbox } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";

const Mainpage = () => {
  const [cities, setCities] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [filteredCities, setFilteredCities] = useState([]);
  const [selectedCountries, setSelectedCountries] = useState([]);
  const observer = useRef();

  const fetchCities = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `https://public.opendatasoft.com/api/explore/v2.1/catalog/datasets/geonames-all-cities-with-a-population-1000/records?limit=20`
      );

      if (!response.ok) throw new Error("Network response was not ok");

      const data = await response.json();
      if (data?.results && Array.isArray(data.results)) {
        setCities((prev) => [...prev, ...data.results]);
        setFilteredCities((prev) => [...prev, ...data.results]);
      }
    } catch (error) {
      console.error("Fetch error:", error);
    } finally {
      setLoading(false);
    }
  }, [page]);

  useEffect(() => {
    fetchCities();
  }, [fetchCities]);

  useEffect(() => {
    let results = cities.filter((city) =>
      city.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (selectedCountries.length > 0) {
      results = results.filter((city) =>
        selectedCountries.includes(city.cou_name_en)
      );
    }

    setFilteredCities(results);
  }, [searchTerm, cities, selectedCountries]);

  const handleChange = (e) => {
    setSearchTerm(e.target.value);
    setShowSuggestions(e.target.value.length > 0);
  };

  const handleScroll = (node) => {
    if (observer.current) observer.current.disconnect();
    observer.current = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && !loading) {
        setPage((prev) => prev + 1);
      }
    });
    if (node) observer.current.observe(node);
  };

  const handleCountryChange = (e) => {
    const { value } = e.target;
    setSelectedCountries((prev) =>
      prev.includes(value)
        ? prev.filter((country) => country !== value)
        : [...prev, value]
    );
  };

  const columns = [
    {
      title: "City Name",
      dataIndex: "name",
      key: "name",
      sorter: (a, b) => {
        return a.name > b.name;
      },
      render: (text, record) => (
        <Link to={`/city-weather/${record.name}`} className="text-blue-500">
          {text}
        </Link>
      ),
    },
    {
      title: "Country",
      dataIndex: "cou_name_en",
      sorter: (a, b) => {
        return a.name > b.name;
      },
      key: "country",
    },
    {
      title: "Population",
      dataIndex: "population",
      key: "population",
    },
    {
      title: "Timezone",
      dataIndex: "timezone",
      key: "timezone",
    },
  ];

  const menuStatus = [
    { id: "1", label: "Germany" },
    { id: "2", label: "Afghanistan" },
  ];

  const filterMenu = (
    <Menu className="w-40 px-3 mt-2">
      {menuStatus.map((value) => (
        <Menu.Item key={value.id}>
          <Checkbox
            value={value.label}
            checked={selectedCountries.includes(value.label)}
            onChange={handleCountryChange}
          >
            {value.label}
          </Checkbox>
        </Menu.Item>
      ))}
    </Menu>
  );

  return (
    <div className="  lg:p-[40px] p-[20px] bg-gray-300 h-screen w-[100vw]">
      <h1 className="text-[19px] lg:text-[27px] font-semibold my-3 text-center">
        Weather Forecast Web Application
      </h1>
      <div className="lg:my-[50px] my-[30px] relative">
        <div className=" flex justify-between ">
          <div className="lg:w-[40vw] ">
            <Input
              placeholder="Search cities..."
              value={searchTerm}
              onChange={handleChange}
              className="mb-4"
              prefix={<SearchOutlined />}
            />
          </div>
          <div>
            <Dropdown overlay={filterMenu} placement="bottom">
              <div className="flex items-center gap-[5px] h-9 justify-center md:w-[100px] w-[50px] bg-[#009ef71c] group hover:bg-[#009ef7] rounded-md cursor-pointer">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="none"
                  className="w-5 h-5 fill-[#009ef769] group-hover:fill-white"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 3c2.755 0 5.455.232 8.083.678.533.09.917.556.917 1.096v1.044a2.25 2.25 0 01-.659 1.591l-5.432 5.432a2.25 2.25 0 00-.659 1.591v2.927a2.25 2.25 0 01-1.244 2.013L9.75 21v-6.568a2.25 2.25 0 00-.659-1.591L3.659 7.409A2.25 2.25 0 013 5.818V4.774c0-.54.384-1.006.917-1.096A48.32 48.32 0 0112 3z"
                  />
                </svg>
                <p className="text-[15px] hidden md:block text-[#009ef7] group-hover:text-white font-semibold">
                  Filter
                </p>
              </div>
            </Dropdown>
          </div>
          {showSuggestions && filteredCities.length > 0 && (
            <ul className="absolute z-10 bg-white border border-gray-300 w-full max-h-60 overflow-auto">
              {filteredCities.slice(0, 5).map((city, index) => (
                <li
                  key={index}
                  onClick={() => {
                    setSearchTerm(city.name);
                    setShowSuggestions(false);
                  }}
                  className="cursor-pointer hover:bg-gray-200 p-2"
                >
                  {city.name} - {city.cou_name_en}
                </li>
              ))}
            </ul>
          )}
        </div>
        <Table
          className="shadow-lg"
          dataSource={filteredCities}
          columns={columns}
          rowKey={(record) => record.geoname_id}
          pagination={false}
          loading={loading && !filteredCities.length}
          scroll={{ y: 400 }}
          onRow={(record, index) => ({
            ref: index === filteredCities.length - 1 ? handleScroll : null,
          })}
        />
        {loading && !filteredCities.length && <Spin className="mt-4" />}
      </div>
    </div>
  );
};

export default Mainpage;
