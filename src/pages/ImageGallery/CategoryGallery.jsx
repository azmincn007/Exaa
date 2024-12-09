import { useQuery } from 'react-query';
import { BASE_URL } from '../../config/config';

export default function CategorySection() {
  const { data: categories = [], isLoading } = useQuery('categories', async () => {
    const response = await fetch(`${BASE_URL}/api/imag-gall-cates`);
    const data = await response.json();
    console.log(data.data);
    return data.data;
  });

  if (isLoading) return <div>Loading...</div>;

  return (
    <div className="w-full max-w-[95%] mx-auto p-4 space-y-8 mt-16 font-Inter">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {categories.map((category) => (
          <div key={category.name} className="space-y-2">
            <h2 className="text-18 font-medium px-1 ">{category.name}</h2>
            <div className="rounded-3xl overflow-hidden">
              <div className="flex">
                {category.images.map((image) => (
                  <div
                    key={image.id}
                    className={`bg-red-500 w-full h-[150px]`}
                    style={{ backgroundImage: `url(${BASE_URL}${image.url})`, backgroundSize: 'cover' }}
                  />
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}


