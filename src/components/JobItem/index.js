import {Link} from 'react-router-dom'
import {MdLocationOn} from 'react-icons/md'
import {BsBriefcaseFill} from 'react-icons/bs'
import {AiFillStar} from 'react-icons/ai'

import './index.css'

const JobItem = props => {
  const {jobDetails} = props
  const {
    id,
    title,
    rating,
    location,
    employmentType,
    packagePerAnnum,
    jobDescription,
    companyLogoUrl,
  } = jobDetails

  return (
    <li className="job-item">
      <Link to={`/jobs/${id}`} className="job-item-link">
        <div className="job-item-header">
          <img
            src={companyLogoUrl}
            alt="company logo"
            className="job-item-logo"
          />
          <div className="job-item-title-container">
            <h1 className="job-item-title">{title}</h1>
            <div className="job-item-rating-container">
              <AiFillStar className="job-item-star-icon" />
              <p className="job-item-rating">{rating}</p>
            </div>
          </div>
        </div>
        <div className="job-item-info">
          <div className="job-item-info-left">
            <div className="job-item-icon-text">
              <MdLocationOn className="job-item-icon" />
              <p className="job-item-text">{location}</p>
            </div>
            <div className="job-item-icon-text">
              <BsBriefcaseFill className="job-item-icon" />
              <p className="job-item-text">{employmentType}</p>
            </div>
          </div>
          <p className="job-item-package">{packagePerAnnum}</p>
        </div>
        <hr className="job-item-line" />
        <h1 className="job-item-description-heading">Description</h1>
        <p className="job-item-description">{jobDescription}</p>
      </Link>
    </li>
  )
}

export default JobItem
