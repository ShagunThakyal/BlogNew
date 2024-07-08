import { Link } from 'react-router-dom';
import logo from '../../assets/horizontal-logo.png';  // Import the logo from assets

export default function Footer() {
    return (
        <footer className="bg-white border-t border-gray-200">
            <div className="container mx-auto p-4 py-6 lg:py-8">
                <div className="flex flex-col gap-8 md:flex-row md:justify-between">
                    <div className="flex justify-center">
                        <Link to="/" className="flex items-center">
                        <img
                        src={logo}  // Use the imported logo
                        className="mr-2 h-14 lg:h-14"  // Increase size for the logo only
                        alt="ZenVibe Logo"
                    />
                        </Link>
                    </div>
                    <div className="grid grid-cols-2 gap-8 sm:gap-6 sm:grid-cols-3">
                        <div>
                            <h2 className="mb-6 text-sm font-semibold text-gray-900 uppercase">Resources</h2>
                            <ul className="text-gray-500 font-medium space-y-4">
                                <li>
                                    <Link to="/" className="hover:text-gray-900">
                                        Home
                                    </Link>
                                </li>
                                <li>
                                    <Link to="/about" className="hover:text-gray-900">
                                        About
                                    </Link>
                                </li>
                            </ul>
                        </div>
                        <div>
                            <h2 className="mb-6 text-sm font-semibold text-gray-900 uppercase">Follow us</h2>
                            <ul className="text-gray-500 font-medium space-y-4">
                                <li>
                                    <a
                                        href="https://github.com/hiteshchoudhary"
                                        className="hover:text-gray-900"
                                        target="_blank"
                                        rel="noreferrer"
                                    >
                                        Github
                                    </a>
                                </li>
                                <li>
                                    <Link to="/" className="hover:text-gray-900">
                                        Discord
                                    </Link>
                                </li>
                            </ul>
                        </div>
                        <div>
                            <h2 className="mb-6 text-sm font-semibold text-gray-900 uppercase">Legal</h2>
                            <ul className="text-gray-500 font-medium space-y-4">
                                <li>
                                    <Link to="#" className="hover:text-gray-900">
                                        Privacy Policy
                                    </Link>
                                </li>
                                <li>
                                    <Link to="#" className="hover:text-gray-900">
                                        Terms &amp; Conditions
                                    </Link>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
                <hr className="my-6 border-gray-200" />
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                    <span className="text-sm text-gray-500 sm:text-center">
                        © 2024
                        <a href="" className="hover:underline">
                            ShagunThakyal
                        </a>
                        . All Rights Reserved.
                    </span>
                    <div className="flex mt-4 space-x-5 sm:mt-0">
                        <a href="#" className="text-gray-500 hover:text-gray-900">
                            <svg
                                className="w-4 h-4"
                                aria-hidden="true"
                                xmlns="http://www.w3.org/2000/svg"
                                fill="currentColor"
                                viewBox="0 0 8 19"
                            >
                                <path
                                    fillRule="evenodd"
                                    d="M6.135 3H8V0H6.135a4.147 4.147 0 0 0-4.142 4.142V6H0v3h2v9.938h3V9h2.021l.592-3H5V3.591A.6.6 0 0 1 5.592 3h.543Z"
                                    clipRule="evenodd"
                                />
                            </svg>
                            <span className="sr-only">Facebook page</span>
                        </a>
                        <a href="#" className="text-gray-500 hover:text-gray-900">
                            <svg
                                className="w-4 h-4"
                                aria-hidden="true"
                                xmlns="http://www.w3.org/2000/svg"
                                fill="currentColor"
                                viewBox="0 0 21 16"
                            >
                                <path d="M16.942 1.556a16.3 16.3 0 0 0-4.126-1.3 12.04 12.04 0 0 0-.529 1.1 15.175 15.175 0 0 0-4.573 0 11.585 11.585 0 0 0-.535-1.1 16.274 16.274 0 0 0-4.129 1.3A17.392 17.392 0 0 0 .182 13.218a15.785 15.785 0 0 0 4.963 2.521c.41-.564.773-1.16 1.084-1.785a10.63 10.63 0 0 1-1.706-.83c.143-.106.283-.217.418-.33a11.664 11.664 0 0 0 10.118 0c.137.113.277.224.418.33-.544.328-1.116.606-1.71.832a12.52 12.52 0 0 0 1.084 1.785 16.46 16.46 0 0 0 5.064-2.595 17.286 17.286 0 0 0-2.973-11.59ZM6.678 10.813a1.941 1.941 0 0 1-1.8-2.045 1.93 1.93 0 0 1 1.8-2.047 1.919 1.919 0 0 1 1.8 2.047 1.93 1.93 0 0 1-1.8 2.045Zm6.644 0a1.94 1.94 0 0 1-1.8-2.045 1.93 1.93 0 0 1 1.8-2.047 1.918 1.918 0 0 1 1.8 2.047 1.93 1.93 0 0 1-1.8 2.045Z" />
                            </svg>
                            <span className="sr-only">Discord community</span>
                        </a>
                        <a href="#" className="text-gray-500 hover:text-gray-900">
                            <svg
                                className="w-4 h-4"
                                aria-hidden="true"
                                xmlns="http://www.w3.org/2000/svg"
                                fill="currentColor"
                                viewBox="0 0 20 17"
                            >
                                <path d="M20 1.892a8.178 8.178 0 0 1-2.355.635 4.074 4.074 0 0 0 1.8-2.235 8.344 8.344 0 0 1-2.605.98A4.13 4.13 0 0 0 13.85 0a4.068 4.068 0 0 0-4.1 4.038 4 4 0 0 0 .105.919A11.705 11.705 0 0 1 1.4.734a4.006 4.006 0 0 0 1.268 5.392 4.165 4.165 0 0 1-1.859-.5v.05A4.057 4.057 0 0 0 4.1 9.635a4.19 4.19 0 0 1-1.856.07 4.108 4.108 0 0 0 3.831 2.807A8.36 8.36 0 0 1 0 14.184 11.732 11.732 0 0 0 6.291 16 11.502 11.502 0 0 0 17.964 4.5c0-.177 0-.35-.012-.523A8.143 8.143 0 0 0 20 1.892Z" />
                            </svg>
                            <span className="sr-only">Twitter page</span>
                        </a>
                        <a href="#" className="text-gray-500 hover:text-gray-900">
                            <svg
                                className="w-4 h-4"
                                aria-hidden="true"
                                xmlns="http://www.w3.org/2000/svg"
                                fill="currentColor"
                                viewBox="0 0 20 20"
                            >
                                <path
                                    fillRule="evenodd"
                                    d="M10 .333a9.84 9.84 0 0 0-5.807 1.789A9.895 9.895 0 0 0 .33 8.924a9.788 9.788 0 0 0 .645 5.116c.042.154.058.302.058.457 0 .588.388 1.057.88 1.268.345.16.623.05.837-.317.163-.274.192-.545.192-.835v-1.585a.674.674 0 0 0-.549-.67c-1.372-.226-2.406-1.085-2.406-2.47 0-1.127.727-1.894 1.786-2.358-.396-.776-.525-1.404-.285-2.024.052-.132.097-.244.13-.362a.618.618 0 0 0-.115-.597A.71.71 0 0 0 1.65 7.2c-.015.042-.018.086-.03.13-.153.78.103 1.524.717 2.186 1.23 1.596 4.37 1.722 5.994 1.722.755 0 1.429-.08 2.08-.25-.178-.758-.476-1.482-.879-2.18a3.005 3.005 0 0 0-1.154-1.028c-.596-.392-.791-.781-.791-1.21 0-.786.529-1.322 1.153-1.322.701 0 1.193.549 1.213 1.163a.7.7 0 0 0 .605.675c1.32.263 2.475 1.016 3.07 2.057.358.646.596 1.41.696 2.188.06.412.089.847.089 1.267v1.88c0 .67.314 1.11.986 1.11.318 0 .545-.182.676-.382a5.207 5.207 0 0 0 2.658-4.67c0-1.32-.54-2.524-1.382-3.391C13.53 4.466 12.416 3.924 11.345 3.82 11.733 2.773 12.306 2.169 13.29 1.773A9.86 9.86 0 0 0 10 .333Zm-2.123 13.204c-.825 0-1.59-.547-1.852-1.319-.303-.745-.049-1.584.605-2.08.662-.51 1.538-.738 2.415-.732.825.006 1.591.548 1.851 1.319.303.745.048 1.584-.605 2.08-.663.511-1.54.738-2.415.732ZM10 1.626a8.227 8.227 0 0 0-5.803 2.237A8.106 8.106 0 0 0 1.898 8.04C2.103 7.261 2.5 6.583 3.015 5.977 3.741 5.196 4.713 4.648 5.797 4.362a9.49 9.49 0 0 1 4.48 0c1.075.286 2.056.834 2.782 1.618.522.552.924 1.146 1.208 1.769a8.126 8.126 0 0 0-.58-2.768A8.217 8.217 0 0 0 10 1.626Z"
                                    clipRule="evenodd"
                                />
                            </svg>
                            <span className="sr-only">GitHub page</span>
                        </a>
                    </div>
                </div>
            </div>
        </footer>
    );
}
