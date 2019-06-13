import React from 'react'
import {Link} from 'react-router-dom'
export default () => {
    return (
        <div>
            <h1>Users</h1>
            <Link to="/user">Go to user</Link>
        </div>
    )
}