import React from 'react'

import PropTypes from 'prop-types'

import OutlineButton from './outline-button'
import './place-card.css'

const PlaceCard = (props) => {
  return (
    <div className="place-card-container">
      <img
        alt={props.image_alt}
        src={props.image}
        className="place-card-image"
      />
      <div className="place-card-container1">
        <span className="place-card-text">{props.city}</span>
        <span className="place-card-text1">{props.description}</span>
        <OutlineButton button1="Discover place"></OutlineButton>
      </div>
    </div>
  )
}

PlaceCard.defaultProps = {
  image:
    'https://images.unsplash.com/photo-1514924013411-cbf25faa35bb?ixlib=rb-1.2.1&q=85&fm=jpg&crop=entropy&cs=srgb&w=1000',
  image_alt: 'image',
  city: 'City Name',
  description:
    'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna.',
}

PlaceCard.propTypes = {
  image: PropTypes.string,
  image_alt: PropTypes.string,
  city: PropTypes.string,
  description: PropTypes.string,
}

export default PlaceCard
