import {Component} from 'react'
import Cookies from 'js-cookie'
import {BsSearch} from 'react-icons/bs'

import Header from '../Header'
import LoaderView from '../LoaderView'
import FiltersGroup from '../FiltersGroup'
import JobItem from '../JobItem'

import './index.css'

const apiStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}

const locationsList = [
  {
    locationId: 'Hyderabad',
    label: 'Hyderabad',
  },
  {
    locationId: 'Bangalore',
    label: 'Bangalore',
  },
  {
    locationId: 'Chennai',
    label: 'Chennai',
  },
  {
    locationId: 'Delhi',
    label: 'Delhi',
  },
  {
    locationId: 'Mumbai',
    label: 'Mumbai',
  },
]

class Jobs extends Component {
  state = {
    profileDetails: {},
    profileApiStatus: apiStatusConstants.initial,
    jobsList: [],
    jobsApiStatus: apiStatusConstants.initial,
    searchInput: '',
    employmentType: [],
    minimumPackage: '',
    selectedLocations: [],
  }

  componentDidMount() {
    this.getProfileDetails()
    this.getJobs()
  }

  getProfileDetails = async () => {
    this.setState({profileApiStatus: apiStatusConstants.inProgress})

    try {
      const jwtToken = Cookies.get('jwt_token')
      const profileApiUrl = 'https://apis.ccbp.in/profile'
      const options = {
        headers: {
          Authorization: `Bearer ${jwtToken}`,
        },
        method: 'GET',
      }

      const response = await fetch(profileApiUrl, options)

      if (response.ok === true) {
        const data = await response.json()
        const updatedProfile = {
          name: data.profile_details.name,
          profileImageUrl: data.profile_details.profile_image_url,
          shortBio: data.profile_details.short_bio,
        }

        this.setState({
          profileDetails: updatedProfile,
          profileApiStatus: apiStatusConstants.success,
        })
      } else {
        this.setState({profileApiStatus: apiStatusConstants.failure})
      }
    } catch (error) {
      this.setState({profileApiStatus: apiStatusConstants.failure})
    }
  }

  getJobs = async () => {
    this.setState({jobsApiStatus: apiStatusConstants.inProgress})

    try {
      const {employmentType, minimumPackage, searchInput} = this.state
      const jwtToken = Cookies.get('jwt_token')
      const employmentTypeString = employmentType.join(',')
      const jobsApiUrl = `https://apis.ccbp.in/jobs?employment_type=${employmentTypeString}&minimum_package=${minimumPackage}&search=${searchInput}`
      const options = {
        headers: {
          Authorization: `Bearer ${jwtToken}`,
        },
        method: 'GET',
      }

      const response = await fetch(jobsApiUrl, options)

      if (response.ok === true) {
        const data = await response.json()
        const updatedJobsList = data.jobs.map(eachJob => ({
          id: eachJob.id,
          title: eachJob.title,
          rating: eachJob.rating,
          location: eachJob.location,
          packagePerAnnum: eachJob.package_per_annum,
          companyLogoUrl: eachJob.company_logo_url,
          employmentType: eachJob.employment_type,
          jobDescription: eachJob.job_description,
        }))

        this.setState({
          jobsList: updatedJobsList,
          jobsApiStatus: apiStatusConstants.success,
        })
      } else {
        this.setState({jobsApiStatus: apiStatusConstants.failure})
      }
    } catch (error) {
      this.setState({jobsApiStatus: apiStatusConstants.failure})
    }
  }

  onChangeSearchInput = event => {
    this.setState({searchInput: event.target.value})
  }

  onClickSearch = () => {
    this.getJobs()
  }

  changeEmploymentType = employmentTypeId => {
    this.setState(
      prevState => ({
        employmentType: prevState.employmentType.includes(employmentTypeId)
          ? prevState.employmentType.filter(each => each !== employmentTypeId)
          : [...prevState.employmentType, employmentTypeId],
      }),
      this.getJobs,
    )
  }

  changeSalaryRange = salaryRangeId => {
    this.setState({minimumPackage: salaryRangeId}, this.getJobs)
  }

  changeLocation = locationId => {
    this.setState(prevState => ({
      selectedLocations: prevState.selectedLocations.includes(locationId)
        ? prevState.selectedLocations.filter(each => each !== locationId)
        : [...prevState.selectedLocations, locationId],
    }))
  }

  getFilteredJobs = () => {
    const {jobsList, selectedLocations} = this.state

    if (selectedLocations.length === 0) {
      return jobsList
    }

    return jobsList.filter(eachJob =>
      selectedLocations.includes(eachJob.location),
    )
  }

  renderProfileSuccessView = () => {
    const {profileDetails} = this.state
    const {name, profileImageUrl, shortBio} = profileDetails

    return (
      <div className="jobs-profile-container">
        <img
          src={profileImageUrl}
          alt="profile"
          className="jobs-profile-image"
        />
        <h1 className="jobs-profile-name">{name}</h1>
        <p className="jobs-profile-bio">{shortBio}</p>
      </div>
    )
  }

  renderProfileFailureView = () => (
    <div className="profile-failure-view">
      <button
        type="button"
        className="retry-button"
        onClick={this.getProfileDetails}
      >
        Retry
      </button>
    </div>
  )

  renderProfileLoaderView = () => (
    <div className="profile-loader-view">
      <LoaderView />
    </div>
  )

  renderProfileView = () => {
    const {profileApiStatus} = this.state

    switch (profileApiStatus) {
      case apiStatusConstants.success:
        return this.renderProfileSuccessView()
      case apiStatusConstants.failure:
        return this.renderProfileFailureView()
      case apiStatusConstants.inProgress:
        return this.renderProfileLoaderView()
      default:
        return null
    }
  }

  renderJobsFailureView = () => (
    <div className="failure-view">
      <img
        src="https://assets.ccbp.in/frontend/react-js/failure-img.png"
        alt="failure view"
        className="failure-image"
      />
      <h1 className="failure-heading">Oops! Something Went Wrong</h1>
      <p className="failure-description">
        We cannot seem to find the page you are looking for.
      </p>
      <button type="button" className="retry-button" onClick={this.getJobs}>
        Retry
      </button>
    </div>
  )

  renderNoJobsView = () => (
    <div className="no-jobs-view">
      <img
        src="https://assets.ccbp.in/frontend/react-js/no-jobs-img.png"
        alt="no jobs"
        className="failure-image"
      />
      <h1 className="failure-heading">No Jobs Found</h1>
      <p className="failure-description">
        We could not find any jobs. Try other filters.
      </p>
    </div>
  )

  renderJobsSuccessView = () => {
    const filteredJobsList = this.getFilteredJobs()

    if (filteredJobsList.length === 0) {
      return this.renderNoJobsView()
    }

    return (
      <ul className="jobs-list">
        {filteredJobsList.map(eachJob => (
          <JobItem key={eachJob.id} jobDetails={eachJob} />
        ))}
      </ul>
    )
  }

  renderJobsView = () => {
    const {jobsApiStatus} = this.state

    switch (jobsApiStatus) {
      case apiStatusConstants.success:
        return this.renderJobsSuccessView()
      case apiStatusConstants.failure:
        return this.renderJobsFailureView()
      case apiStatusConstants.inProgress:
        return <LoaderView />
      default:
        return null
    }
  }

  render() {
    const {searchInput} = this.state
    const {employmentTypesList, salaryRangesList} = this.props

    return (
      <>
        <Header />
        <div className="jobs-container">
          <div className="filters-container">
            {this.renderProfileView()}
            <FiltersGroup
              employmentTypesList={employmentTypesList}
              salaryRangesList={salaryRangesList}
              locationsList={locationsList}
              changeEmploymentType={this.changeEmploymentType}
              changeSalaryRange={this.changeSalaryRange}
              changeLocation={this.changeLocation}
            />
          </div>

          <div className="jobs-content">
            <div className="search-input-container">
              <input
                type="search"
                placeholder="Search"
                className="search-input"
                value={searchInput}
                onChange={this.onChangeSearchInput}
              />
              <button
                type="button"
                data-testid="searchButton"
                className="search-button"
                onClick={this.onClickSearch}
              >
                <BsSearch className="search-icon" />
              </button>
            </div>

            <div className="jobs-results">{this.renderJobsView()}</div>
          </div>
        </div>
      </>
    )
  }
}

export default Jobs
