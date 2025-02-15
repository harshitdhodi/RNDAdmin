import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";

const useDocumentTitle = () => {
  const location = useLocation();
  const [metaTitle, setMetaTitle] = useState("Loading...");

  useEffect(() => {
    const fetchMetaTitle = async () => {
      try {
        const response = await axios.get("/api/meta/get-meta");
        if (response.data && Array.isArray(response.data.data)) {
          const metaDataList = response.data.data;
          const currentPath = location.pathname.toLowerCase();

          // Check for exact match
          let matchedMeta = metaDataList.find(
            (meta) => `/${meta.pageSlug.toLowerCase()}` === currentPath
          );

          if (!matchedMeta) {
            // Fallback to "static-page" if no exact match
            matchedMeta = metaDataList.find(
              (meta) => meta.pageSlug.toLowerCase() === "static-page"
            );
          }

          setMetaTitle(matchedMeta ? matchedMeta.metaTitle : "Static Page");
        }
      } catch (error) {
        console.error("Error fetching meta data:", error);
        setMetaTitle("Static Page - Default Meta Title"); // Fallback in case of an error
      }
    };

    fetchMetaTitle();
  }, [location]);

  // Update document title
  useEffect(() => {
    document.title = metaTitle;
  }, [metaTitle]);
};
    
export default useDocumentTitle;
