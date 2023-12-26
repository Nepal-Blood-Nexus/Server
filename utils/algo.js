// Haversine algorithm
module.exports.calculateDistance = (userLocation, destination) => {
    let [u_lat, u_long] = userLocation.split(",");
    let [d_lat, d_long] = destination.split(",");
    u_lat = parseFloat(u_lat) * (Math.PI / 180);
    u_long = parseFloat(u_long) * (Math.PI / 180);
    d_lat = d_lat * (Math.PI / 180);
    d_long = d_long * (Math.PI / 180);
  
    let dlon = d_long - u_long;
    let dlat = d_lat - u_lat;
    let a =
      Math.pow(Math.sin(dlat / 2), 2) +
      Math.cos(u_lat) * Math.cos(d_lat) * Math.pow(Math.sin(dlon / 2), 2);
  
    let c = 2 * Math.asin(Math.sqrt(a));
    // Radius of earth in kilometers
    let r = 6371;
    // calculate the res
    return (c * r).toFixed(2);
  };
  

