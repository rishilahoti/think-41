'use client';

import { useState, useEffect, use } from 'react';

export default function Home() {
	const [users, setUsers] = useState([]);
	const [orders, setOrders] = useState([]);
	const [search, setSearch] = useState('');
	const [selectedUser, setSelectedUser] = useState(null);

	useEffect(() => {
		fetch('http://localhost:4000/users')
			.then((response) => response.json())
			.then((data) => setUsers(data))
			.catch((error) => console.error('Error fetching users:', error));
	}, []);

	useEffect(() => {
		if (!selectedUser) return;
		fetch(`http://localhost:4000/users/${selectedUser.id}/orders`)
			.then((response) => response.json())
			.then((data) => setOrders(data))
			.catch((error) => console.error('Error fetching orders:', error));
	}, [selectedUser]);

	const filtered = users.filter((user) =>
		user.first_name.toLowerCase().includes(search.toLowerCase()) ||
        user.last_name.toLowerCase().includes(search.toLowerCase()) ||
        user.email.toLowerCase().includes(search.toLowerCase())
	);

    return(
        <main className='p-8 bg-gray-50 min-h-screen'>
            <h2 className='text-2xl font-bold mb-4'>User Dashboard</h2>
            <input
                type='text'
                placeholder='Search by name or email...'
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className='mb-4 p-2 border rounded w-full'
            />
            <table className='w-full'>
                <thead>
                    <tr>
                        <th className='border p-2'>ID</th>
                        <th className='border p-2'>Name</th>
                        <th className='border p-2'>Email</th>
                    </tr>
                </thead>
                <tbody>
                    {filtered.map((user) => (
                        <tr
                            key={user.id}
                            onClick={() => setSelectedUser(user)}
                            className='cursor-pointer hover:bg-gray-100'
                        >
                            <td className='border p-2'>{user.id}</td>
                            <td className='border p-2'>{user.first_name}</td>
                            <td className='border p-2'>{user.email}</td>
                        </tr>
                    ))}
                    
                </tbody>
            </table>
            {selectedUser && (
                <div className='mt-6 p-4'>
                    <h3>
                        <p>
                            Name: {selectedUser.first_name} {selectedUser.last_name}
                        </p>
                        <p>Email: {selectedUser.email}</p>
                    </h3>
                </div>
            )}
        </main>
    );
}
