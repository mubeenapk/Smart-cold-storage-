import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const EditProfile = () => {
    const nav = useNavigate();
    const sid = sessionStorage.getItem('sid');
    if (!sid) return null;

    const [fullName, setFullName]   = useState('');
    const [email, setEmail]         = useState('');
    

    

    /* 2. user + current selections */
    useEffect(() => {
        axios.get(`http://localhost:5000/staff/${sid}`).then(res => {
            const u = res.data.data;
            setFullName(u.fullName);
            setEmail(u.email);
            
        });
    }, [sid]);

    

    /* 4. save */
    const handleSave = () => {
        axios.put(`http://localhost:5000/staff/${sid}`, { fullName, email})
             .then(() => alert('Profile updated'))
             .catch(() => alert('Update failed'));
    };

    /* 5. render */
    return (
        <div style={{ padding: 20 }}>
            <h3>Edit Profile</h3>
            <table border="1" cellPadding="8">
                <tbody>
                    <tr>
                        <td>Name</td>
                        <td><input value={fullName} onChange={e => setFullName(e.target.value)} /></td>
                    </tr>
                    <tr>
                        <td>Email</td>
                        <td><input type="email" value={email} onChange={e => setEmail(e.target.value)} /></td>
                    </tr>
                    <tr>
                        
                    </tr>
                    <tr>
                        <td colSpan="2" align="center"><button onClick={handleSave}>Save</button></td>
                    </tr>
                </tbody>
            </table>
        </div>
    );
};

export default EditProfile;