USE root_db;
-- Sample data for the users table
INSERT INTO `users` (`name`, `email`, `password`) VALUES
('John Doe', 'john.doe@example.com', 'hashed_password_1'),
('Jane Smith', 'jane.smith@example.com', 'hashed_password_2'),
('Peter Jones', 'peter.jones@example.com', 'hashed_password_3');

-- Sample data for the products table
INSERT INTO `products` (`name`, `description`, `price`) VALUES
('Laptop', 'A high-performance laptop for all your needs.', 1200.00),
('Smartphone', 'The latest smartphone with amazing features.', 800.00),
('Headphones', 'Noise-cancelling headphones for an immersive audio experience.', 150.00),
('Keyboard', 'A mechanical keyboard for typing enthusiasts.', 100.00);

-- Sample data for the orders table
-- John Doe orders a Laptop and Headphones
INSERT INTO `orders` (`user_id`, `product_id`, `quantity`) VALUES
(1, 1, 1),
(1, 3, 2);

-- Jane Smith orders a Smartphone
INSERT INTO `orders` (`user_id`, `product_id`, `quantity`) VALUES
(2, 2, 1);

-- Peter Jones orders a Keyboard and Headphones
INSERT INTO `orders` (`user_id`, `product_id`, `quantity`) VALUES
(3, 4, 1),
(3, 3, 1);
