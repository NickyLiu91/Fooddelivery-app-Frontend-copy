import React, { useState, useRef, useCallback, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Polygon as MapPolygon } from '@react-google-maps/api';
import { zonesColors } from './Boundaries.styled';

function getZoneColor(index) {
  return zonesColors[index % zonesColors.length];
}

const getOptions = index => ({
  strokeColor: getZoneColor(index),
  strokeOpacity: 0.8,
  strokeWeight: 3,
  fillColor: getZoneColor(index),
  fillOpacity: 0.2,
});

function Polygon({
  bounds,
  onChange,
  editable,
  index,
}) {
  const [path, setPath] = useState(bounds);

  const polygonRef = useRef(null);
  const listenersRef = useRef([]);

  const onEdit = useCallback(() => {
    if (polygonRef.current) {
      const nextPath = polygonRef.current
        .getPath()
        .getArray()
        .map(latLng => ({ lat: latLng.lat(), lng: latLng.lng() }));
      if (editable) {
        setPath(nextPath);
        onChange(nextPath);
      }
    }
  }, [editable, onChange]);

  useEffect(() => {
    setPath(bounds);
  }, [bounds, editable]);

  const onLoad = useCallback(
    polygon => {
      polygonRef.current = polygon;
      const polygonPath = polygon.getPath();
      listenersRef.current.push(
        polygonPath.addListener('set_at', onEdit),
        polygonPath.addListener('insert_at', onEdit),
        polygonPath.addListener('remove_at', onEdit),
      );
    },
    [onEdit],
  );

  const onUnmount = useCallback(() => {
    if (editable) {
      listenersRef.current.forEach(lis => lis.remove());
      polygonRef.current = null;
    }
  }, [editable]);

  return (
    <MapPolygon
      editable={editable}
      draggable={editable}
      path={path}
      onMouseUp={onEdit}
      // onDragEnd={onEdit}
      options={getOptions(index)}
      onLoad={onLoad}
      onUnmount={onUnmount}
    />
  );
}

Polygon.propTypes = {
  bounds: PropTypes.arrayOf(PropTypes.shape({
    lat: PropTypes.oneOfType([
      PropTypes.func,
      PropTypes.number,
    ]),
    lng: PropTypes.oneOfType([
      PropTypes.func,
      PropTypes.number,
    ]),
  })).isRequired,
  onChange: PropTypes.func.isRequired,
  editable: PropTypes.bool.isRequired,
  index: PropTypes.number.isRequired,
};

export default Polygon;

