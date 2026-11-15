import {AiFillStar} from 'react-icons/ai'
import {MdLocationOn} from 'react-icons/md'
import {BsBriefcaseFill} from 'react-icons/bs'

import './index.css'

const SimilarJobItem = props => {
  const {jobDetails} = props
  const {
    title,
    rating,
    location,
    employmentType,
    jobDescription,
    companyLogoUrl,
  } = jobDetails

  return (
    <li className="similar-job-item">
      <div className="similar-job-header">
        <img
          src={companyLogoUrl}
          alt="similar job company logo"
          className="similar-job-logo"
        />
        <div>
          <h1 className="similar-job-title">{title}</h1>
          <div className="similar-job-rating-container">
            <AiFillStar className="similar-job-star-icon" />
            <p className="similar-job-rating">{rating}</p>
          </div>
        </div>
      </div>

      <h1 className="similar-job-description-heading">Description</h1>
      <p className="similar-job-description">{jobDescription}</p>

      <div className="similar-job-info">
        <div className="similar-job-icon-text">
          <MdLocationOn className="similar-job-icon" />
          <p className="similar-job-text">{location}</p>
        </div>
        <div className="similar-job-icon-text">
          <BsBriefcaseFill className="similar-job-icon" />
          <p className="similar-job-text">{employmentType}</p>
        </div>
      </div>
    </li>
  )
}

export default SimilarJobItem
