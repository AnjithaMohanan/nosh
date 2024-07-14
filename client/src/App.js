import React, { useEffect, useState } from 'react';
import axios from 'axios';
import io from 'socket.io-client';
import styled from 'styled-components';

const socket = io('http://localhost:5000'); // Connect to the backend server

const DashboardContainer = styled.div`
  padding: 20px;
  background-color: #f8f9fa;
  font-family: Arial, sans-serif;
`;

const Title = styled.h1`
  text-align: center;
  color: #343a40;
`;

const DishList = styled.ul`
  display: flex;
  flex-wrap: wrap;
  justify-content: space-around;
  padding: 0;
`;

const DishItem = styled.li`
  list-style: none;
  background: #fff;
  border: 1px solid #dee2e6;
  border-radius: 8px;
  margin: 10px;
  padding: 20px;
  width: 200px;
  text-align: center;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
`;

const DishImage = styled.img`
  max-width: 100%;
  border-radius: 8px;
`;

const DishName = styled.h2`
  font-size: 1.2em;
  color: #495057;
`;

const DishStatus = styled.p`
  font-size: 1em;
  color: ${props => (props.isPublished ? '#28a745' : '#dc3545')};
`;

const ToggleButton = styled.button`
  background-color: ${props => (props.isPublished ? '#dc3545' : '#28a745')};
  color: #fff;
  border: none;
  padding: 10px 20px;
  border-radius: 8px;
  cursor: pointer;
  transition: background-color 0.3s;
  
  &:hover {
    background-color: ${props => (props.isPublished ? '#c82333' : '#218838')};
  }
`;
const Footer = styled.footer`
  text-align: center;
  margin-top: 190px;
  font-size: 1em;
  color: #6c757d;
`;

function Dashboard() {
  const [dishes, setDishes] = useState([]);

  useEffect(() => {
    fetchDishes();

    // Listen for real-time updates from the server
    socket.on('dishStatusChanged', (updatedDish) => {
      setDishes((prevDishes) =>
        prevDishes.map((dish) => (dish.dishId === updatedDish.dishId ? updatedDish : dish))
      );
    });

    return () => {
      socket.off('dishStatusChanged');
    };
  }, []);

  const fetchDishes = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/dishes');
      setDishes(response.data);
    } catch (error) {
      console.error('Failed to fetch dishes:', error);
    }
  };

  const toggleDishStatus = async (dishId) => {
    try {
      const response = await axios.post(`http://localhost:5000/api/dishes/${dishId}/toggle`);
      setDishes((prevDishes) =>
        prevDishes.map((dish) => (dish.dishId === response.data.dishId ? response.data : dish))
      );
    } catch (error) {
      console.error('Failed to toggle dish status:', error);
    }
  };

  return (
    <DashboardContainer>
      <Title>Dish Dashboard Nosh</Title>
      <DishList>
        {dishes.map((dish) => (
          <DishItem key={dish.dishId}>
            <DishImage src={dish.imageUrl} alt={dish.dishName} />
            <DishName>{dish.dishName}</DishName>
            <DishStatus isPublished={dish.isPublished}>
              {dish.isPublished ? 'Published' : 'Unpublished'}
            </DishStatus>
            <ToggleButton 
              onClick={() => toggleDishStatus(dish.dishId)} 
              isPublished={dish.isPublished}
            >
              {dish.isPublished ? 'Unpublish' : 'Publish'}
            </ToggleButton>
          </DishItem>
        ))}
      </DishList>
    
      <Footer>
        @anjitha 2024
      </Footer>
      
    </DashboardContainer>
  );
}

export default Dashboard;
