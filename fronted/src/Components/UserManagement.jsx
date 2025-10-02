// export default UserManagement;
import { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";

const UserManagement = () => {
  const [search, setSearch] = useState("");
  const [users, setUsers] = useState([]);

  const fetchData = async () => {
    try {
      const response = await fetch("http://127.0.0.1:8000/api/users");

      if (!response.ok) {
        console.log("Data fetch error, check URL");
        return;
      }

      const data = await response.json();
      setUsers(data.users);
    } catch (err) {
      console.log("Fix errors: ", err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const filteredUsers = users.filter((user) =>
    user.name.toLowerCase().includes(search.toLowerCase())
  );
  console.log(filteredUsers);

  return (
    <div className="min-h-screen bg-gray-100 py-10 px-4 pt-2">
      <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-lg p-8 pt-1">
        <h1 className="text-3xl font-bold mb-6 text-gray-800 pt-3 text-center">
          User Management
        </h1>
        <div className="mb-6 text-center">
          <input
            type="text"
            placeholder="Search users..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-md px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300 text-center"
          />
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white rounded-lg">
            <thead>
              <tr>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-700 uppercase">
                  Name
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={4} className="text-center py-6 text-gray-400">
                    No users found.
                  </td>
                </tr>
              ) : (
                filteredUsers.map((user, index) => (
                  <tr key={index} className="hover:bg-blue-400 transition text-center">
                    <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">
                      <NavLink
                        to={`/messages/${user.id}`}
                        className="no-underline text-blue-600 hover:underline"
                      >
                        {user.name}
                      </NavLink>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default UserManagement;
