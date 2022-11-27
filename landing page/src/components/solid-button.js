import React from 'react'

import PropTypes from 'prop-types'

import './solid-button.css'

const SolidButton = (props) => {
  return (
    <div className={`solid-button-container ${props.rootClassName} `}>
      <button autoFocus className="solid-button-button button Button">
        {props.button}
      </button>
    </div>
  )
}

SolidButton.defaultProps = {
  button: 'Button',
  rootClassName: '',
}

SolidButton.propTypes = {
  button: PropTypes.string,
  rootClassName: PropTypes.string,
}

export default SolidButton
