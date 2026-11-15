import './index.css'

const FiltersGroup = props => {
  const {
    employmentTypesList,
    salaryRangesList,
    changeEmploymentType,
    changeSalaryRange,
  } = props

  const renderEmploymentTypes = () => (
    <div className="filter-group">
      <h1 className="filter-heading">Type of Employment</h1>
      <ul className="filters-list">
        {employmentTypesList.map(eachType => (
          <li key={eachType.employmentTypeId} className="filter-item">
            <input
              type="checkbox"
              id={eachType.employmentTypeId}
              onChange={() => changeEmploymentType(eachType.employmentTypeId)}
            />
            <label className="input-label" htmlFor={eachType.employmentTypeId}>
              {eachType.label}
            </label>
          </li>
        ))}
      </ul>
    </div>
  )

  const renderSalaryRanges = () => (
    <div className="filter-group">
      <h1 className="filter-heading">Salary Range</h1>
      <ul className="filters-list">
        {salaryRangesList.map(eachRange => (
          <li key={eachRange.salaryRangeId} className="filter-item">
            <input
              type="radio"
              name="salary"
              id={eachRange.salaryRangeId}
              onChange={() => changeSalaryRange(eachRange.salaryRangeId)}
            />
            <label className="input-label" htmlFor={eachRange.salaryRangeId}>
              {eachRange.label}
            </label>
          </li>
        ))}
      </ul>
    </div>
  )

  return (
    <div className="filters-group-container">
      <hr />
      {renderEmploymentTypes()}
      <hr />
      {renderSalaryRanges()}
    </div>
  )
}

export default FiltersGroup
