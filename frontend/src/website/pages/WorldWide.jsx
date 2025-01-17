import img from '../images/introduction.png'
import { Banner } from "../componets/Banner"
import CountriesTable from "../componets/worldwide/CountriesTable"
import { Link } from 'react-router-dom'
import { useGetAllWorldwideQuery } from '../../slice/worldwide/worldwide'

export default function WorldWide() {
    const { data: worldwideData, isLoading } = useGetAllWorldwideQuery();

    // Ensure we're working with an array and handle the data structure properly
    const allData = worldwideData?.data || [];  // Access the data property if it exists
    
    // Separate international and Indian data
    const internationalData = allData.filter(item => item.category === 'international');
    const indiaData = allData.filter(item => item.category === 'india');
console.log( indiaData)
    return (
        <main className="min-h-screen bg-white">
            <Banner imageUrl={img} />
            
            <div className="max-w-[75rem] mx-auto">
                <nav className="py-2 border-b border-gray-200 ">
                    <div className="flex items-center space-x-2 text-sm">
                        <Link href="/" className="text-gray-600 hover:text-gray-900">
                            Home
                        </Link>
                        <span className="text-gray-400">&raquo;</span>
                        <span className="text-orange-500">Worldwide</span>
                    </div>
                </nav>
                <div className=" pr-12 py-8">
                    <div>
                        <h2 className="text-3xl font-bold text-gray-900 mb-2">Worldwide</h2>
                        <div className="w-[6%] h-1 mb-5 bg-orange-500"></div>
                    </div>
                    
                    {/* International Section */}
                    <div className="mb-12">
                        <div className="inline-block bg-blue-800 text-white px-4 py-1 mt-2 text-2xl md:text-3xl font-bold mb-6">
                            In International
                        </div>
                        <p className="text-gray-600 mb-8">
                            We are having distributors network for more than 50 countries of the world.
                        </p>
                        {isLoading ? (
                            <div>Loading...</div>
                        ) : (
                            <CountriesTable data={internationalData} />
                        )}
                    </div>

                    {/* India Section */}
                    <div className="mb-12">
                        <div className="inline-block bg-blue-800 text-white px-4 py-1 text-2xl md:text-3xl font-bold  mb-6">
                           In India
                        </div>
                        <p className="text-gray-600 mb-8">
                            Our presence across Indian states and cities
                        </p>
                        {isLoading ? (
                            <div>Loading...</div>
                        ) : (
                            <CountriesTable 
                                data={indiaData}
                                isIndiaTable={true}
                            />
                        )}
                    </div>
                </div>
            </div>
        </main>
    )
}

