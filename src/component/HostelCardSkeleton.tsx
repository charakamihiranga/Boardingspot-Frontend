
export default function  HostelCardSkeleton (){
    return (
        <div className="rounded-xl overflow-hidden bg-white">
            <div className="relative aspect-[4/3] overflow-hidden rounded-xl m-2">
                <div className="w-full h-full bg-gray-200 animate-pulse rounded-xl"></div>
            </div>
            <div className="p-4">
                <div className="flex justify-between items-center mb-4">
                    <div className="h-4 bg-gray-200 rounded w-1/3 animate-pulse"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/4 animate-pulse"></div>
                </div>
                <div className="h-6 bg-gray-200 rounded w-full mb-2 animate-pulse"></div>
                <div className="h-6 bg-gray-200 rounded w-2/3 mb-4 animate-pulse"></div>
                <div className="h-5 bg-gray-200 rounded w-1/4 mb-4 animate-pulse"></div>
                <div className="h-4 bg-gray-200 rounded w-1/3 mb-6 animate-pulse"></div>
                <div className="mt-2 pt-3 border-t border-gray-100 flex justify-between">
                    <div className="h-6 bg-gray-200 rounded w-1/3 animate-pulse"></div>
                    <div className="h-6 bg-gray-200 rounded-full w-6 animate-pulse"></div>
                </div>
            </div>
        </div>
    );
};