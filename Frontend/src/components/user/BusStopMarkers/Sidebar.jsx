import "./Sidebar.css";
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import AnimatedList from '../../animatedList/AnimatedList'

function Sidebar({ busData, setData }) {
    const [query, setQuery] = useState("");
    const [filteredBusNumber, setFilteredBusNumber] = useState(busData);

    useEffect(() => {
        setFilteredBusNumber(busData);
    }, [busData]);

    const handleSearch = (text) => {
        setQuery(text);
        const filtered = busData.filter((busNumber) =>
            busNumber.bus_number.toLowerCase().includes(text.toLowerCase())
        );
        setFilteredBusNumber(filtered);
    };

    return (
        <>
            <div className="sidebar">
                {/* <!-- From Uiverse.io by Lakshay-art --> */}
                <div id="poda">
                    <div className="glow"></div>
                    <div className="darkBorderBg"></div>
                    <div className="darkBorderBg"></div>
                    <div className="darkBorderBg"></div>

                    <div className="white"></div>

                    <div className="border"></div>

                    <div id="main">
                        <input placeholder="Search Bus Number..." type="text" name="text" className="input" value={query} onChange={(e) => handleSearch(e.target.value)}/>
                        <div id="input-mask"></div>
                        <div id="pink-mask"></div>
                        <div id="search-icon">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="24"
                                viewBox="0 0 24 24"
                                strokeWidth="2"
                                strokeLinejoin="round"
                                strokeLinecap="round"
                                height="24"
                                fill="none"
                                className="feather feather-search"
                            >
                                <circle stroke="url(#search)" r="8" cy="11" cx="11"></circle>
                                <line
                                    stroke="url(#searchl)"
                                    y2="16.65"
                                    y1="22"
                                    x2="16.65"
                                    x1="22"
                                ></line>
                                <defs>
                                    <linearGradient gradientTransform="rotate(50)" id="search">
                                        <stop stopColor="#f8e7f8" offset="0%"></stop>
                                        <stop stopColor="#b6a9b7" offset="50%"></stop>
                                    </linearGradient>
                                    <linearGradient id="searchl">
                                        <stop stopColor="#b6a9b7" offset="0%"></stop>
                                        <stop stopColor="#837484" offset="50%"></stop>
                                    </linearGradient>
                                </defs>
                            </svg>
                        </div>
                    </div>
                </div>
                <AnimatedList
                    items={filteredBusNumber}
                    onItemSelect={(item, index) => console.log(item, index)}
                    showGradients={true}
                    enableArrowNavigation={true}
                    displayScrollbar={true}
                />
            </div>
        </>
    );
}

export default Sidebar;



// import "./Sidebar.css";
// import { useState, useEffect } from 'react';
// import { motion } from 'framer-motion';
// import AnimatedList from '../../animatedList/AnimatedList'

// function Sidebar({ busData, setData }) {
//     const [query, setQuery] = useState("");
//     const [filteredBusNumber, setFilteredBusNumber] = useState(busData);

//     useEffect(() => {
//         setFilteredBusNumber(busData);
//     }, [busData]);

//     const handleSearch = (text) => {
//         setQuery(text);
//         const filtered = busData.filter((busNumber) =>
//             busNumber.bus_number.toLowerCase().includes(text.toLowerCase())
//         );
//         setFilteredBusNumber(filtered);
//     };

//     return (
//         <>
//             <div className="sidebar">
//                 <div className="sidebar-header">
//                     <input
//                         type="text"
//                         placeholder="Search bus number..."
//                         value={query}
//                         onChange={(e) => handleSearch(e.target.value)}
//                     />
//                 </div>
//                 <ul type="none">
//                     {filteredBusNumber.map((busNumber, index) => (
//                         <>
//                             <motion.li
//                                 className="stop"
//                                 key={index}
//                                 initial={{ opacity: 0, y: 20 }}
//                                 animate={{ opacity: 1, y: 0 }}
//                                 transition={{ delay: index * 0.05, duration: 0.3, ease: 'easeOut' }}
//                                 data-bs-toggle="collapse" data-bs-target={"#collapseExample" + index} aria-expanded="false" aria-controls="collapseExample"
//                             >
                                // <h3>{busNumber.bus_number}</h3>
                                // <div className="bus-route">
                                //     <img className="bus-symbol" src="/bus.svg" alt="Bus" />
                                //     <p>
                                //         {busNumber.coordinates[0]?.name} &#8596; {busNumber.coordinates.at(-1)?.name}
                                //     </p>
                                // </div>
//                             </motion.li>
//                             <div className="collapse timeline" id={"collapseExample" + index}>
//                                 <ul className="card card-body">
//                                     {busNumber.coordinates.map((stop, index) => (
//                                         <li key={index}>{stop.name}</li>
//                                     ))}
//                                 </ul>
//                             </div>
//                         </>
//                     ))}
//                 </ul>
//             </div>
//         </>
//     );
// }

// export default Sidebar;



