import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const products = [
    // Appetizers
    { name: 'Spring Rolls', category: 'Appetizers', price: 90, imageUrl: 'https://images.pexels.com/photos/35407775/pexels-photo-35407775.jpeg?auto=compress&cs=tinysrgb&w=800' },
    { name: 'Calamares', category: 'Appetizers', price: 130, imageUrl: 'https://images.pexels.com/photos/921367/pexels-photo-921367.jpeg?auto=compress&cs=tinysrgb&w=800' },
    { name: 'Nachos Supreme', category: 'Appetizers', price: 140, imageUrl: 'https://images.pexels.com/photos/5211212/pexels-photo-5211212.jpeg?auto=compress&cs=tinysrgb&w=800' },
    { name: 'Buffalo Wings', category: 'Appetizers', price: 150, imageUrl: 'https://images.pexels.com/photos/11299734/pexels-photo-11299734.jpeg?auto=compress&cs=tinysrgb&w=800' },
    { name: 'Mozzarella Sticks', category: 'Appetizers', price: 120, imageUrl: 'https://images.pexels.com/photos/5639378/pexels-photo-5639378.jpeg?auto=compress&cs=tinysrgb&w=800' },

    // Soups
    { name: 'Chicken Sotanghon Soup', category: 'Soups', price: 80, imageUrl: 'https://images.pexels.com/photos/30392957/pexels-photo-30392957.jpeg?auto=compress&cs=tinysrgb&w=800' },
    { name: 'Cream of Mushroom Soup', category: 'Soups', price: 75, imageUrl: 'https://images.pexels.com/photos/4103375/pexels-photo-4103375.jpeg?auto=compress&cs=tinysrgb&w=800' },
    { name: 'Beef Nilaga', category: 'Soups', price: 140, imageUrl: 'https://images.pexels.com/photos/34636461/pexels-photo-34636461.jpeg?auto=compress&cs=tinysrgb&w=800' },

    // Rice Meals
    { name: 'Chicken Meal', category: 'Rice Meals', price: 150, imageUrl: 'https://images.pexels.com/photos/21822134/pexels-photo-21822134.jpeg?auto=compress&cs=tinysrgb&w=800' },
    { name: 'Beef Tapa Meal', category: 'Rice Meals', price: 160, imageUrl: 'https://images.pexels.com/photos/36566222/pexels-photo-36566222.jpeg?auto=compress&cs=tinysrgb&w=800' },
    { name: 'Pork Sisig Meal', category: 'Rice Meals', price: 155, imageUrl: 'https://images.pexels.com/photos/30355484/pexels-photo-30355484.jpeg?auto=compress&cs=tinysrgb&w=800' },
    { name: 'Bangus Meal', category: 'Rice Meals', price: 145, imageUrl: 'https://images.pexels.com/photos/6213713/pexels-photo-6213713.jpeg?auto=compress&cs=tinysrgb&w=800' },
    { name: 'Adobo Meal', category: 'Rice Meals', price: 150, imageUrl: 'https://images.pexels.com/photos/6525933/pexels-photo-6525933.jpeg?auto=compress&cs=tinysrgb&w=800' },

    // Chicken
    { name: 'Fried Chicken (2pc)', category: 'Chicken', price: 140, imageUrl: 'https://images.pexels.com/photos/145804/pexels-photo-145804.jpeg?auto=compress&cs=tinysrgb&w=800' },
    { name: 'Grilled Chicken', category: 'Chicken', price: 160, imageUrl: 'https://images.pexels.com/photos/106343/pexels-photo-106343.jpeg?auto=compress&cs=tinysrgb&w=800' },
    { name: 'Chicken Wings (6pc)', category: 'Chicken', price: 150, imageUrl: 'https://images.pexels.com/photos/32067295/pexels-photo-32067295.jpeg?auto=compress&cs=tinysrgb&w=800' },

    // Burgers
    { name: 'Chicken Burger', category: 'Burgers', price: 120, imageUrl: 'https://images.pexels.com/photos/1431305/pexels-photo-1431305.jpeg?auto=compress&cs=tinysrgb&w=800' },
    { name: 'Classic Beef Burger', category: 'Burgers', price: 130, imageUrl: 'https://images.pexels.com/photos/8162589/pexels-photo-8162589.jpeg?auto=compress&cs=tinysrgb&w=800' },
    { name: 'Cheese Burger Deluxe', category: 'Burgers', price: 145, imageUrl: 'https://images.pexels.com/photos/16659975/pexels-photo-16659975.jpeg?auto=compress&cs=tinysrgb&w=800' },
    { name: 'Bacon Burger', category: 'Burgers', price: 155, imageUrl: 'https://images.pexels.com/photos/20321273/pexels-photo-20321273.jpeg?auto=compress&cs=tinysrgb&w=800' },

    // Sandwiches
    { name: 'Club Sandwich', category: 'Sandwiches', price: 135, imageUrl: 'https://images.pexels.com/photos/28681955/pexels-photo-28681955.jpeg?auto=compress&cs=tinysrgb&w=800' },
    { name: 'Grilled Cheese Sandwich', category: 'Sandwiches', price: 95, imageUrl: 'https://images.pexels.com/photos/14941252/pexels-photo-14941252.jpeg?auto=compress&cs=tinysrgb&w=800' },
    { name: 'Tuna Sandwich', category: 'Sandwiches', price: 110, imageUrl: 'https://images.pexels.com/photos/38578723/pexels-photo-38578723.jpeg?auto=compress&cs=tinysrgb&w=800' },

    // Fast Food
    { name: 'French Fries', category: 'Fast Food', price: 60, imageUrl: 'https://images.pexels.com/photos/4109234/pexels-photo-4109234.jpeg?auto=compress&cs=tinysrgb&w=800' },
    { name: 'Onion Rings', category: 'Fast Food', price: 70, imageUrl: 'https://images.pexels.com/photos/1109195/pexels-photo-1109195.jpeg?auto=compress&cs=tinysrgb&w=800' },
    { name: 'Cheese Sticks', category: 'Fast Food', price: 80, imageUrl: 'https://images.pexels.com/photos/9650081/pexels-photo-9650081.jpeg?auto=compress&cs=tinysrgb&w=800' },
    { name: 'Hotdog on Stick', category: 'Fast Food', price: 55, imageUrl: 'https://images.pexels.com/photos/24738516/pexels-photo-24738516.jpeg?auto=compress&cs=tinysrgb&w=800' },

    // Pasta & Noodles
    { name: 'Spaghetti', category: 'Pasta & Noodles', price: 100, imageUrl: 'https://images.pexels.com/photos/725990/pexels-photo-725990.jpeg?auto=compress&cs=tinysrgb&w=800' },
    { name: 'Carbonara', category: 'Pasta & Noodles', price: 120, imageUrl: 'https://images.pexels.com/photos/19062760/pexels-photo-19062760.jpeg?auto=compress&cs=tinysrgb&w=800' },
    { name: 'Beef Pares', category: 'Pasta & Noodles', price: 130, imageUrl: 'https://images.pexels.com/photos/37784136/pexels-photo-37784136.jpeg?auto=compress&cs=tinysrgb&w=800' },
    { name: 'Pancit Canton', category: 'Pasta & Noodles', price: 95, imageUrl: 'https://images.pexels.com/photos/5724558/pexels-photo-5724558.jpeg?auto=compress&cs=tinysrgb&w=800' },
    { name: 'Ramen', category: 'Pasta & Noodles', price: 150, imageUrl: 'https://images.pexels.com/photos/12984979/pexels-photo-12984979.jpeg?auto=compress&cs=tinysrgb&w=800' },

    // Pizza
    { name: 'Margherita Pizza', category: 'Pizza', price: 220, imageUrl: 'https://images.pexels.com/photos/14590497/pexels-photo-14590497.jpeg?auto=compress&cs=tinysrgb&w=800' },
    { name: 'Pepperoni Pizza', category: 'Pizza', price: 240, imageUrl: 'https://images.pexels.com/photos/708587/pexels-photo-708587.jpeg?auto=compress&cs=tinysrgb&w=800' },
    { name: 'Hawaiian Pizza', category: 'Pizza', price: 230, imageUrl: 'https://images.pexels.com/photos/11710527/pexels-photo-11710527.jpeg?auto=compress&cs=tinysrgb&w=800' },

    // Salads
    { name: 'Caesar Salad', category: 'Salads', price: 110, imageUrl: 'https://images.pexels.com/photos/8251537/pexels-photo-8251537.jpeg?auto=compress&cs=tinysrgb&w=800' },
    { name: 'Garden Salad', category: 'Salads', price: 90, imageUrl: 'https://images.pexels.com/photos/3743537/pexels-photo-3743537.jpeg?auto=compress&cs=tinysrgb&w=800' },

    // Desserts
    { name: 'Chocolate Cake', category: 'Desserts', price: 90, imageUrl: 'https://images.pexels.com/photos/30128890/pexels-photo-30128890.jpeg?auto=compress&cs=tinysrgb&w=800' },
    { name: 'Leche Flan', category: 'Desserts', price: 70, imageUrl: 'https://images.pexels.com/photos/4773405/pexels-photo-4773405.jpeg?auto=compress&cs=tinysrgb&w=800' },
    { name: 'Mango Float', category: 'Desserts', price: 85, imageUrl: 'https://images.pexels.com/photos/28250932/pexels-photo-28250932.jpeg?auto=compress&cs=tinysrgb&w=800' },
    { name: 'Ice Cream Sundae', category: 'Desserts', price: 65, imageUrl: 'https://images.pexels.com/photos/1352282/pexels-photo-1352282.jpeg?auto=compress&cs=tinysrgb&w=800' },
    { name: 'Halo-Halo', category: 'Desserts', price: 95, imageUrl: 'https://images.pexels.com/photos/17572958/pexels-photo-17572958.jpeg?auto=compress&cs=tinysrgb&w=800' },

    // Drinks
    { name: 'Coke', category: 'Drinks', price: 40, imageUrl: 'https://images.pexels.com/photos/16826278/pexels-photo-16826278.jpeg?auto=compress&cs=tinysrgb&w=800' },
    { name: 'Sprite', category: 'Drinks', price: 40, imageUrl: 'https://images.pexels.com/photos/4161715/pexels-photo-4161715.jpeg?auto=compress&cs=tinysrgb&w=800' },
    { name: 'Iced Tea', category: 'Drinks', price: 45, imageUrl: 'https://images.pexels.com/photos/1484678/pexels-photo-1484678.jpeg?auto=compress&cs=tinysrgb&w=800' },
    { name: 'Fresh Buko Juice', category: 'Drinks', price: 55, imageUrl: 'https://images.pexels.com/photos/36473412/pexels-photo-36473412.jpeg?auto=compress&cs=tinysrgb&w=800' },
    { name: 'Mango Shake', category: 'Drinks', price: 70, imageUrl: 'https://images.pexels.com/photos/6063291/pexels-photo-6063291.jpeg?auto=compress&cs=tinysrgb&w=800' },
    { name: 'Bottled Water', category: 'Drinks', price: 25, imageUrl: 'https://images.pexels.com/photos/11860562/pexels-photo-11860562.jpeg?auto=compress&cs=tinysrgb&w=800' },
    { name: 'Hot Coffee', category: 'Drinks', price: 50, imageUrl: 'https://images.pexels.com/photos/4256790/pexels-photo-4256790.jpeg?auto=compress&cs=tinysrgb&w=800' },
    { name: 'Iced Coffee', category: 'Drinks', price: 65, imageUrl: 'https://images.pexels.com/photos/6896001/pexels-photo-6896001.jpeg?auto=compress&cs=tinysrgb&w=800' },
  ].map((p) => ({ ...p, isAvailable: true }));

  for (const product of products) {
    const { count } = await prisma.product.updateMany({
      where: { name: product.name },
      data: product,
    });
    if (count === 0) {
      await prisma.product.create({ data: product });
    }
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
