export default function CountriesTable({ data, isIndiaTable = false }) {
    const chunkArray = (arr, size) => {
        const chunkedArr = [];
        for (let i = 0; i < arr.length; i += size) {
            chunkedArr.push(arr.slice(i, i + size));
        }
        return chunkedArr;
    };

    if (!isIndiaTable) {
        // International table logic remains the same
        const rows = chunkArray(data, 5);
        
        return (
            <div className="overflow-x-auto w-full">
                <table className="table-fixed w-full divide-y divide-gray-200">
                    <tbody className="bg-white divide-y divide-gray-800">
                        {rows.map((row, rowIndex) => (
                            <tr key={rowIndex}>
                                {row.map((item, colIndex) => (
                                    <td key={colIndex} className="px-4 py-2 border border-gray-300 whitespace-normal">
                                        <div className="text-sm text-gray-900">
                                            {item.name}
                                        </div>
                                    </td>
                                ))}
                                {[...Array(5 - row.length)].map((_, i) => (
                                    <td key={`empty-${i}`} className="px-4 py-2 border">
                                        <div className="text-sm text-gray-900"></div>
                                    </td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        );
    }

    // For India table, create a flat array of cells
    const flatCells = data.reduce((acc, item) => {
        // Add state as a cell
        if (item.state) {
            acc.push({
                content: item.state,
                isState: true
            });
        }
        // Add cities as cells
        item.cities.forEach(city => {
            acc.push({
                content: city,
                isState: false
            });
        });
        return acc;
    }, []);

    // Create rows with 5 columns
    const rows = chunkArray(flatCells, 5);

    return (
        <div className="overflow-x-auto w-full">
            <table className="table-fixed w-full divide-y divide-gray-200">
                <tbody className="bg-white divide-y divide-gray-200">
                    {rows.map((row, rowIndex) => (
                        <tr key={rowIndex}>
                            {row.map((cell, colIndex) => (
                                <td key={colIndex} className="px-4 py-2 border whitespace-normal">
                                    <div className="text-sm text-gray-900">
                                        {cell.isState ? (
                                            <div className="font-bold">{cell.content}</div>
                                        ) : (
                                            <div>· {cell.content}</div>
                                        )}
                                    </div>
                                </td>
                            ))}
                            {[...Array(5 - row.length)].map((_, i) => (
                                <td key={`empty-${i}`} className="px-4 py-2 border">
                                    <div className="text-sm text-gray-900"></div>
                                </td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}