import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import styled from 'styled-components'
import { GiHamburgerMenu } from 'react-icons/gi'
import toast from 'react-hot-toast'


function Header({ currentUser, updateUser, getCookie }) {
    const [menu, setMenu] = useState(false)
    const navigate = useNavigate()
  
    const handleLogout = async () => {
      try {
        const resp = await fetch("/api/v1/logout", {
          method: "DELETE",
          headers: {
            "X-CSRF-TOKEN": getCookie("csrf_access_token"),
            "Authorization": `Bearer ${getCookie("jwt_token")}`
          }
        });
    
        if (resp.ok) {
          updateUser(null);
          toast.success("Logged out successfully.");
          navigate("/about"); 
        } else {
          const data = await resp.json();
          toast.error(data.error || "Failed to log out.");
        }
      } catch (err) {
        toast.error("An error occurred while logging out.");
      }
    };

    return (
      <Nav>
        <Logo>
          <Link to="/dashboard">Goal Getter</Link>
        </Logo>
        <HamburgerMenu onClick={() => setMenu((prev) => !prev)}>
          <GiHamburgerMenu size={30} />
        </HamburgerMenu>
        <NavMenu className={menu ? "open" : ""}>
          <CloseButton onClick={() => setMenu(false)}>×</CloseButton>
          <NavList>
            <li>
              <Link to="/about">About</Link>
            </li>
            {currentUser ? (
              <>
                <li>
                  <Link to="/dashboard">Dashboard</Link>
                </li>
                <li>
                  <Link to="/settings">Profile</Link>
                </li>
                <li>
                  <button onClick={handleLogout}>Logout</button>
                </li>
              </>
            ) : (
              <li>
                <Link to="/register">Register Now!</Link>
              </li>
            )}
          </NavList>
        </NavMenu>
      </Nav>
    );
  }
  
  export default Header;
  
  // Styled Components
  const Nav = styled.nav`
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 10px 20px;
    background-color: #f8f9fa;
    border-bottom: 1px solid #e9ecef;
    position: relative;
    z-index: 1000;
  
    @media (max-width: 768px) {
      padding: 10px;
    }
  `;
  
  const Logo = styled.div`
    font-family: "Splash", cursive;
    font-size: 24px;
  
    a {
      text-decoration: none;
      color: #333;
    }
  
    a:hover {
      color: #007bff;
    }
  `;
  
  const HamburgerMenu = styled.div`
    display: none;
    cursor: pointer;
  
    @media (max-width: 768px) {
      display: block;
    }
  `;
  
  const NavMenu = styled.div`
    display: flex;
    align-items: center;
  
    @media (max-width: 768px) {
      flex-direction: column;
      position: absolute;
      top: 0;
      right: 0;
      width: 250px;
      height: 100%;
      background-color: white;
      box-shadow: -2px 0 5px rgba(0, 0, 0, 0.1);
      transform: translateX(100%);
      transition: transform 0.3s ease-in-out;
  
      &.open {
        transform: translateX(0);
      }
    }
  `;
  
  const CloseButton = styled.div`
    display: none;
    font-size: 24px;
    padding: 10px 20px;
    cursor: pointer;
    text-align: right;
  
    @media (max-width: 768px) {
      display: block;
    }
  `;
  
  const NavList = styled.ul`
    display: flex;
    list-style: none;
    gap: 20px;
  
    li {
      a {
        text-decoration: none;
        color: #333;
        font-family: Arial, sans-serif;
        font-size: 16px;
      }
  
      a:hover {
        color: #007bff;
      }
  
      button {
        background: none;
        border: none;
        color: #007bff;
        font-size: 16px;
        cursor: pointer;
      }
  
      button:hover {
        color: #0056b3;
        text-decoration: underline;
      }
    }
  
    @media (max-width: 768px) {
      flex-direction: column;
      padding: 20px;
  
      li {
        margin-bottom: 15px;
      }
    }
  `;
