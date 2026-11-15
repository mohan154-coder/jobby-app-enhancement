import {Component} from 'react'
import {Link, withRouter} from 'react-router-dom'
import Cookies from 'js-cookie'
import {GiHamburgerMenu} from 'react-icons/gi'
import {AiOutlineClose} from 'react-icons/ai'

import './index.css'

class Header extends Component {
  state = {
    showMenu: false,
  }

  onToggleMenu = () => {
    this.setState(prevState => ({showMenu: !prevState.showMenu}))
  }

  onCloseMenu = () => {
    this.setState({showMenu: false})
  }

  onClickLogout = () => {
    Cookies.remove('jwt_token')
    const {history} = this.props
    history.replace('/login')
  }

  render() {
    const {showMenu} = this.state
    const menuClassName = showMenu ? 'nav-menu nav-menu-open' : 'nav-menu'

    return (
      <nav className="nav-header">
        <div className="nav-content">
          <Link to="/">
            <img
              src="https://assets.ccbp.in/frontend/react-js/logo-img.png"
              alt="website logo"
              className="website-logo"
            />
          </Link>

          <button
            type="button"
            className="menu-button"
            onClick={this.onToggleMenu}
          >
            {showMenu ? (
              <AiOutlineClose className="menu-icon" />
            ) : (
              <GiHamburgerMenu className="menu-icon" />
            )}
          </button>

          <ul className={menuClassName}>
            <li className="nav-item nav-item-home">
              <Link to="/" className="nav-link" onClick={this.onCloseMenu}>
                Home
              </Link>
            </li>
            <li className="nav-item nav-item-jobs">
              <Link to="/jobs" className="nav-link" onClick={this.onCloseMenu}>
                Jobs
              </Link>
            </li>
            <li className="nav-item">
              <button
                type="button"
                className="logout-button"
                onClick={this.onClickLogout}
              >
                Logout
              </button>
            </li>
          </ul>
        </div>
      </nav>
    )
  }
}

export default withRouter(Header)
