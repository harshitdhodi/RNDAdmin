import { Link } from "react-router-dom";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

export function BreadcrumbWithCustomSeparator({ items }) {
  return (
    <Breadcrumb>
      <BreadcrumbList>
        {items.map((item, index) => (
          <BreadcrumbItem key={index}>
            {index === items.length - 1 ? (
<<<<<<< HEAD
              <BreadcrumbPage className="text-[#3b1f91] font-medium">
=======
              <BreadcrumbPage className="text-[#304a8a] font-medium">
>>>>>>> 6eaae5458c9d9da428bbbf6655b2150ac7ea833b
                {item.label}
              </BreadcrumbPage>
            ) : (
              <BreadcrumbLink>
                <Link className="text-gray-500 hover:text-black" to={item.href}>
                  {item.label}
                </Link>
              </BreadcrumbLink>
            )}
            {index < items.length - 1 && <BreadcrumbSeparator />}
          </BreadcrumbItem>
        ))}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
