import {Component} from 'react'
import Cookies from 'js-cookie'
import {AiFillStar} from 'react-icons/ai'
import {MdLocationOn} from 'react-icons/md'
import {BsBriefcaseFill} from 'react-icons/bs'
import {BiLinkExternal} from 'react-icons/bi'

import Header from '../Header'
import LoaderView from '../LoaderView'
import SimilarJobItem from '../SimilarJobItem'

import './index.css'

const apiStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}

class JobItemDetails extends Component {
  state = {
    jobDetails: {},
    similarJobs: [],
    apiStatus: apiStatusConstants.initial,
  }

  componentDidMount() {
    this.getJobDetails()
  }

  getJobDetails = async () => {
    this.setState({apiStatus: apiStatusConstants.inProgress})

    try {
      const jwtToken = Cookies.get('jwt_token')
      const {match} = this.props
      const {id} = match.params
      const jobDetailsApiUrl = `https://apis.ccbp.in/jobs/${id}`
      const options = {
        headers: {
          Authorization: `Bearer ${jwtToken}`,
        },
        method: 'GET',
      }

      const response = await fetch(jobDetailsApiUrl, options)

      if (response.ok === true) {
        const data = await response.json()
        const job = data.job_details

        const updatedJobDetails = {
          id: job.id,
          title: job.title,
          rating: job.rating,
          location: job.location,
          employmentType: job.employment_type,
          packagePerAnnum: job.package_per_annum,
          companyLogoUrl: job.company_logo_url,
          companyWebsiteUrl: job.company_website_url,
          jobDescription: job.job_description,
          skills: job.skills.map(eachSkill => ({
            name: eachSkill.name,
            imageUrl: eachSkill.image_url,
          })),
          lifeAtCompany: {
            description: job.life_at_company.description,
            imageUrl: job.life_at_company.image_url,
          },
        }

        const updatedSimilarJobs = data.similar_jobs.map(eachJob => ({
          id: eachJob.id,
          title: eachJob.title,
          rating: eachJob.rating,
          location: eachJob.location,
          employmentType: eachJob.employment_type,
          companyLogoUrl: eachJob.company_logo_url,
          jobDescription: eachJob.job_description,
        }))

        this.setState({
          jobDetails: updatedJobDetails,
          similarJobs: updatedSimilarJobs,
          apiStatus: apiStatusConstants.success,
        })
      } else {
        this.setState({apiStatus: apiStatusConstants.failure})
      }
    } catch (error) {
      this.setState({apiStatus: apiStatusConstants.failure})
    }
  }

  renderFailureView = () => (
    <div className="job-details-failure-view">
      <img
        src="https://assets.ccbp.in/frontend/react-js/failure-img.png"
        alt="failure view"
        className="job-details-failure-image"
      />
      <h1 className="job-details-failure-heading">
        Oops! Something Went Wrong
      </h1>
      <p className="job-details-failure-description">
        We cannot seem to find the page you are looking for.
      </p>
      <button
        type="button"
        className="job-details-retry-button"
        onClick={this.getJobDetails}
      >
        Retry
      </button>
    </div>
  )

  renderSuccessView = () => {
    const {jobDetails, similarJobs} = this.state
    const {
      title,
      rating,
      location,
      employmentType,
      packagePerAnnum,
      companyLogoUrl,
      companyWebsiteUrl,
      jobDescription,
      skills,
      lifeAtCompany,
    } = jobDetails
    const {description, imageUrl} = lifeAtCompany

    return (
      <div className="job-details-container">
        <div className="job-details-card">
          <div className="job-details-header">
            <img
              src={companyLogoUrl}
              alt="job details company logo"
              className="job-details-logo"
            />
            <div>
              <h1 className="job-details-title">{title}</h1>
              <div className="job-details-rating-container">
                <AiFillStar className="job-details-star-icon" />
                <p className="job-details-rating">{rating}</p>
              </div>
            </div>
          </div>

          <div className="job-details-info">
            <div className="job-details-info-left">
              <div className="job-details-icon-text">
                <MdLocationOn className="job-details-icon" />
                <p className="job-details-text">{location}</p>
              </div>
              <div className="job-details-icon-text">
                <BsBriefcaseFill className="job-details-icon" />
                <p className="job-details-text">{employmentType}</p>
              </div>
            </div>
            <p className="job-details-package">{packagePerAnnum}</p>
          </div>

          <hr className="job-details-line" />

          <div className="job-details-description-header">
            <h1 className="job-details-description-heading">Description</h1>
            <a
              href={companyWebsiteUrl}
              target="_blank"
              rel="noreferrer"
              className="job-details-visit-link"
            >
              Visit <BiLinkExternal />
            </a>
          </div>
          <p className="job-details-description">{jobDescription}</p>

          <h1 className="job-details-section-heading">Skills</h1>
          <ul className="job-details-skills-list">
            {skills.map(eachSkill => (
              <li key={eachSkill.name} className="job-details-skill-item">
                <img
                  src={eachSkill.imageUrl}
                  alt={eachSkill.name}
                  className="job-details-skill-image"
                />
                <p className="job-details-skill-name">{eachSkill.name}</p>
              </li>
            ))}
          </ul>

          <h1 className="job-details-section-heading">Life at Company</h1>
          <div className="job-details-life-container">
            <p className="job-details-life-description">{description}</p>
            <img
              src={imageUrl}
              alt="life at company"
              className="job-details-life-image"
            />
          </div>
        </div>

        <h1 className="job-details-section-heading">Similar Jobs</h1>
        <ul className="similar-jobs-list">
          {similarJobs.map(eachJob => (
            <SimilarJobItem key={eachJob.id} jobDetails={eachJob} />
          ))}
        </ul>
      </div>
    )
  }

  renderJobDetailsView = () => {
    const {apiStatus} = this.state

    switch (apiStatus) {
      case apiStatusConstants.success:
        return this.renderSuccessView()
      case apiStatusConstants.failure:
        return this.renderFailureView()
      case apiStatusConstants.inProgress:
        return <LoaderView />
      default:
        return null
    }
  }

  render() {
    return (
      <div className="job-details-page">
        <Header />
        {this.renderJobDetailsView()}
      </div>
    )
  }
}

export default JobItemDetails
