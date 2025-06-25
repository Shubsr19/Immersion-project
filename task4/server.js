const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

let vehicles = [
  {
    id: 1,
    vehicleName: 'Tesla Model S',
    price: 94990,
    image: 'https://images.pexels.com/photos/193991/pexels-photo-193991.jpeg?auto=compress&cs=tinysrgb&w=500',
    desc: 'Luxury electric sedan with autopilot capabilities',
    brand: 'Tesla'
  },
  {
    id: 2,
    vehicleName: 'BMW X5',
    price: 61600,
    image: 'https://images.pexels.com/photos/244206/pexels-photo-244206.jpeg?auto=compress&cs=tinysrgb&w=500',
    desc: 'Premium SUV with advanced features',
    brand: 'BMW'
  },
  {
    id: 3,
    vehicleName: 'Honda Civic',
    price: 23100,
    image: 'https://images.pexels.com/photos/136872/pexels-photo-136872.jpeg?auto=compress&cs=tinysrgb&w=500',
    desc: 'Reliable compact car with excellent fuel economy',
    brand: 'Honda'
  }
];

let nextId = 4;


app.get('/', (req, res) => {
  res.render('index', { vehicles });
});

app.get('/vehicles/new', (req, res) => {
  res.render('new-vehicle');
});

app.get('/vehicles/:id/edit', (req, res) => {
  const id = parseInt(req.params.id);
  const vehicle = vehicles.find(v => v.id === id);
  
  if (!vehicle) {
    return res.status(404).render('error', { message: 'Vehicle not found' });
  }
  
  res.render('edit-vehicle', { vehicle });
});

app.get('/vehicles/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const vehicle = vehicles.find(v => v.id === id);
  
  if (!vehicle) {
    return res.status(404).render('error', { message: 'Vehicle not found' });
  }
  
  res.render('vehicle-detail', { vehicle });
});


app.get('/api/vehicles', (req, res) => {
  res.json({
    success: true,
    data: vehicles,
    count: vehicles.length
  });
});

app.get('/api/vehicles/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const vehicle = vehicles.find(v => v.id === id);
  
  if (!vehicle) {
    return res.status(404).json({
      success: false,
      message: 'Vehicle not found'
    });
  }
  
  res.json({
    success: true,
    data: vehicle
  });
});

app.post('/api/vehicles', (req, res) => {
  const { vehicleName, price, image, desc, brand } = req.body;
  
  if (!vehicleName || !price || !brand) {
    return res.status(400).json({
      success: false,
      message: 'Vehicle name, price, and brand are required'
    });
  }
  
  const newVehicle = {
    id: nextId++,
    vehicleName,
    price: parseFloat(price),
    image: image || 'https://images.pexels.com/photos/170811/pexels-photo-170811.jpeg?auto=compress&cs=tinysrgb&w=500',
    desc: desc || '',
    brand
  };
  
  vehicles.push(newVehicle);
  
  res.status(201).json({
    success: true,
    data: newVehicle,
    message: 'Vehicle created successfully'
  });
});

app.put('/api/vehicles/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const vehicleIndex = vehicles.findIndex(v => v.id === id);
  
  if (vehicleIndex === -1) {
    return res.status(404).json({
      success: false,
      message: 'Vehicle not found'
    });
  }
  
  const { vehicleName, price, image, desc, brand } = req.body;
  
  if (vehicleName) vehicles[vehicleIndex].vehicleName = vehicleName;
  if (price) vehicles[vehicleIndex].price = parseFloat(price);
  if (image) vehicles[vehicleIndex].image = image;
  if (desc !== undefined) vehicles[vehicleIndex].desc = desc;
  if (brand) vehicles[vehicleIndex].brand = brand;
  
  res.json({
    success: true,
    data: vehicles[vehicleIndex],
    message: 'Vehicle updated successfully'
  });
});

app.delete('/api/vehicles/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const vehicleIndex = vehicles.findIndex(v => v.id === id);
  
  if (vehicleIndex === -1) {
    return res.status(404).json({
      success: false,
      message: 'Vehicle not found'
    });
  }
  
  const deletedVehicle = vehicles.splice(vehicleIndex, 1)[0];
  
  res.json({
    success: true,
    data: deletedVehicle,
    message: 'Vehicle deleted successfully'
  });
});

app.post('/vehicles', (req, res) => {
  const { vehicleName, price, image, desc, brand } = req.body;
  
  if (!vehicleName || !price || !brand) {
    return res.status(400).render('error', { 
      message: 'Vehicle name, price, and brand are required' 
    });
  }
  
  const newVehicle = {
    id: nextId++,
    vehicleName,
    price: parseFloat(price),
    image: image || 'https://images.pexels.com/photos/170811/pexels-photo-170811.jpeg?auto=compress&cs=tinysrgb&w=500',
    desc: desc || '',
    brand
  };
  
  vehicles.push(newVehicle);
  res.redirect('/');
});

app.post('/vehicles/:id/update', (req, res) => {
  const id = parseInt(req.params.id);
  const vehicleIndex = vehicles.findIndex(v => v.id === id);
  
  if (vehicleIndex === -1) {
    return res.status(404).render('error', { message: 'Vehicle not found' });
  }
  
  const { vehicleName, price, image, desc, brand } = req.body;
  
  if (vehicleName) vehicles[vehicleIndex].vehicleName = vehicleName;
  if (price) vehicles[vehicleIndex].price = parseFloat(price);
  if (image) vehicles[vehicleIndex].image = image;
  if (desc !== undefined) vehicles[vehicleIndex].desc = desc;
  if (brand) vehicles[vehicleIndex].brand = brand;
  
  res.redirect('/');
});

app.post('/vehicles/:id/delete', (req, res) => {
  const id = parseInt(req.params.id);
  const vehicleIndex = vehicles.findIndex(v => v.id === id);
  
  if (vehicleIndex !== -1) {
    vehicles.splice(vehicleIndex, 1);
  }
  
  res.redirect('/');
});

app.use('*', (req, res) => {
  res.status(404).render('error', { message: 'Page not found' });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  console.log(`API endpoints available at http://localhost:${PORT}/api/vehicles`);
});