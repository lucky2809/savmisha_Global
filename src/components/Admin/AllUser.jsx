import React, { useEffect, useState } from "react";
import axios from "axios";

function AllUser() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const getUsers = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/all-users`);
      setUsers(res.data.users);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching users:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    getUsers();
  }, []);

  if (loading) {
    return <p className="text-center mt-10">Loading users...</p>;
  }

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">All Users</h2>

      <div className="overflow-x-auto">
        <table className="min-w-full border border-gray-300 rounded-lg">
          <thead className="bg-gray-100">
            <tr>
              <th className="border p-2">#</th>
              <th className="border p-2">Name</th>
              <th className="border p-2">Email</th>
              <th className="border p-2">Phone No.</th>
              <th className="border p-2">Role</th>
              <th className="border p-2">Created At</th>
            </tr>
          </thead>

          <tbody>
            {users.map((user, index) => (
              <tr key={user._id} className="text-center hover:bg-gray-50">
                <td className="border p-2">{index + 1}</td>
                <td className="border p-2">{user.fullname}</td>
                <td className="border p-2">{user.email}</td>
                <td className="border p-2">{user.phone}</td>
                <td className="border p-2">{user.role}</td>
                <td className="border p-2">
                  {new Date(user.createdAt).toLocaleDateString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default AllUser;