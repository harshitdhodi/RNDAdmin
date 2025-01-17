import React from "react";
import { useGetAllTemplatesQuery, useDeleteTemplateMutation } from "@/slice/template/emailTemplate";
import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "react-router-dom";

const TemplateTable = () => {
  const { data, error, isLoading } = useGetAllTemplatesQuery();
  const [deleteTemplate] = useDeleteTemplateMutation();
  const navigate = useNavigate();

  // Access the templates array if nested inside a "data" key
  const templates = data?.data || [];

  // Add this state to track expanded rows
  const [expandedRows, setExpandedRows] = React.useState({});

  // Add this function to toggle row expansion
  const toggleRowExpansion = (id) => {
    setExpandedRows(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  // Add this function to truncate text
  const truncateText = (text, maxLength = 100) => {
    const strippedText = text.replace(/<[^>]+>/g, '');
    if (strippedText.length <= maxLength) return text;
    return strippedText.substring(0, maxLength) + '...';
  };

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  const handleEdit = (id) => {
    navigate(`/edit-template/${id}`);
  };

  const handleDelete = async (id) => {
    try {
      await deleteTemplate(id).unwrap();
      alert("Template deleted successfully!");
    } catch (error) {
      alert("Failed to delete template: " + error.message);
    }
  };

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-xl font-bold">Email Templates</h1>
        <Link to="/add-template">
          <Button className="bg-[#3b1f91] text-white hover:bg-purple-700" variant="primary">
            Add SMTP
          </Button>
        </Link>
      </div>
      <hr className="mb-5" />
      <table className="table-auto w-full border-collapse border border-gray-300">
        <thead>
          <tr className="bg-gray-200">
            <th className="border border-gray-300 px-4 py-2">Category</th>
            <th className="border border-gray-300 px-4 py-2">Subject</th>
            <th className="border border-gray-300 px-4 py-2">Body</th>
            <th className="border border-gray-300 px-4 py-2">Action</th>
          </tr>
        </thead>
        <tbody>
          {templates.map((template) => (
            <tr key={template._id} className="hover:bg-gray-100">
              <td className="border border-gray-300 px-4 py-2">{template.category.emailCategory}</td>
              <td className="border border-gray-300 px-4 py-2">{template.subject}</td>
              <td className="border border-gray-300 px-4 py-2">
                <div
                  dangerouslySetInnerHTML={{
                    __html: expandedRows[template._id] 
                      ? template.body 
                      : truncateText(template.body)
                  }}
                />
                {template.body.length > 100 && (
                  <Button
                    variant="link"
                    className="text-[#3b1f91] p-0 h-auto font-medium"
                    onClick={() => toggleRowExpansion(template._id)}
                  >
                    {expandedRows[template._id] ? 'Show Less' : 'Read More'}
                  </Button>
                )}
              </td>
              <td className="border border-gray-300 px-4 py-2">
                <div className="flex gap-2">
                  <Button variant="secondary" className="hover:bg-[#4f359c]" size="sm" onClick={() => handleEdit(template._id)}>
                    Edit
                  </Button>
                  <Button variant="destructive" size="sm" onClick={() => handleDelete(template._id)}>
                    Delete
                  </Button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TemplateTable;
