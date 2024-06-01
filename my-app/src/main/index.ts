//@ts-nocheck

import { app, BrowserWindow, screen, ipcMain, shell } from 'electron'
import { join } from 'path'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
function createWindow(): void {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: Math.round((screen.getPrimaryDisplay().workAreaSize.width * 0.95)), // 80% of screen width
    height: Math.round((screen.getPrimaryDisplay().workAreaSize.height * 0.9)), // 60% of screen height
    show: false,
    autoHideMenuBar: true,
    icon: join(__dirname, '../renderer/src/public/fabric.png'),
    ...(process.platform === 'linux' ? {  } : {}),
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false,
      nodeIntegration: true,
      contextIsolation:false,
    }
  })

  mainWindow.on('ready-to-show', () => {
    mainWindow.show()
  })

  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return { action: 'deny' }
  })

  // HMR for renderer base on electron-vite cli.
  // Load the remote URL for development or the local html file for production.
  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
  }
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  // Set app user model id for windows
  electronApp.setAppUserModelId('com.electron')

  // Default open or close DevTools by F12 in development
  // and ignore CommandOrControl + R in production.
  // see https://github.com/alex8088/electron-toolkit/tree/master/packages/utils
  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })

  // IPC test

  createWindow()

  app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

// In this file you can include the rest of your app"s specific main process
// code. You can also put them in separate files and require them here.


//DATES 
const TwoYearsAgo = new Date(new Date().getFullYear(), new Date().getMonth() - 24, 1);
const yearAgo = new Date(new Date().getFullYear(), new Date().getMonth() - 12, 1);
const sexMonthsAgo = new Date(new Date().getTime() - (180 * 24 * 60 * 60 * 1000));
const ninetyDaysAgo = new Date(new Date().getTime() - (90 * 24 * 60 * 60 * 1000));
const thirtyDaysAgo = new Date(new Date().getTime() - (30 * 24 * 60 * 60 * 1000));
const currentMonth  = new Date(new Date().getFullYear(), new Date().getMonth(), 1);
const lastMonth     = new Date(new Date().getFullYear(), new Date().getMonth() - 1, 1);
const nextMonth    = new Date(new Date().getFullYear(), new Date().getMonth() + 1, 1);
const lastThreeMonths = new Date(new Date().getFullYear(), new Date().getMonth() - 3, 1);
const nextThreeMonths    = new Date(new Date().getFullYear(), new Date().getMonth() + 3, 1);
const lastSixMonths = new Date(new Date().getFullYear(), new Date().getMonth() - 6, 1);
const nextSixMonths    = new Date(new Date().getFullYear(), new Date().getMonth() + 6, 1);


//generate random customers 
/*
function RandomCustomer() {
  Array.from({ length: 100 }, async () => {
    const randomNumebr = Math.floor(Math.random() * 11).toString();
    const date = faker.date.between({from: '2024-03-01', to: '2024-3-15'});
    const formattedDate = new Date(date);
    const formattedDateStr = formattedDate.toISOString();
    const name = faker.person.firstName();
    const phone = faker.phone.number();
    const address = faker.location.streetAddress();
    const storeName = faker.company.name();
    const CompanyID = faker.string.numeric();
    await prisma.user.create({
      data: {
        name: name,
        phone: phone,
        createdAt:formattedDateStr,
        UserBackground:randomNumebr,
        Address:address,
        StoreName:storeName,
        CompanyID:CompanyID
      },
    });
  }
  )};


*/

ipcMain.handle('fetch-orders', async (event, args) => {
 
  try {
    const orders = await prisma.order.findMany({
      where: {
        createdAt: {
          gte: thirtyDaysAgo, // Date 30 days ago
        }
      },
      orderBy: [
        {
           createdAt: 'desc',
        },
        {
           id: 'desc',
        }
     ],
      include: {
        user: true,
        company: true
      }
    });
    return orders;
  }
catch (error) {
    console.error('Error fetching users:', error);
    throw error;
  }

});


ipcMain.handle('add-order', async (event, args) => {
  const randomNumebr = Math.floor(Math.random() * 11).toString();
  // format the date 
  const date = args.createdAt;
  const formattedDate = new Date(date);
  const formattedDateOrder= formattedDate.toISOString();
  const formattedDateStr = new Date().toISOString();
  try {
   
    let user = await prisma.user.findFirst({
      where: {
          name: args.user, // Replace with the customer's name
      },
  });
  let company = await prisma.company.findFirst({
    where: {
      name: args.company, // Replace with the customer's name
    },
});

  // If the user doesn't exist, create a new user
  if (!user) {
      // Create the new user
      user = await prisma.user.create({
          data: {
              name: args.user,
              phone:"null", // Replace with the customer's name
              createdAt:formattedDateStr,
              UserBackground:randomNumebr,
              Address:"null",
              StoreName:"null",
              CompanyID:"null" // Other user properties if applicable
          },
      });
  }

  if (!company) {
    // Create the new user
    company = await prisma.company.create({
        data: {
            name: args.company,
            phone:"null",
            createdAt:formattedDateStr,
            Address:"null",
            CompanyBackground :randomNumebr,       // Replace with the customer's name
                            // Other user properties if applicable
        },
    });
}
     await prisma.order.create({
        data: {
          user: {
            connect: { id: user.id } // Connect the order to the found or newly created user by userId
        },
        company: {
          connect: { id: company.id } // Connect the order to the found or newly created user by userId
      },
            amount: args.amount,
            status: args.status,
            unit: args.unit,
            fabricType: args.address,
            price: args.price,
            createdAt: formattedDateOrder,
            address: "null",
        },
    });
    
} catch (error) {
    console.error('Error creating order:', error);
}

});



ipcMain.handle('fetch-status', async (event, args) => {
  const lastMonthDate = new Date();
  lastMonthDate.setMonth(lastMonthDate.getMonth() - 1);

  const currentMonth  = new Date(new Date().getFullYear(), new Date().getMonth(), 1);
  const nextMonth    = new Date(new Date().getFullYear(), new Date().getMonth() + 1, 1);

    try {
      const result = await prisma.order.aggregate({
        _count: {
          _all: true,
        },
        where: {
          createdAt: {
            gte: currentMonth, // Start of current month
            lt: nextMonth // Start of next month
          },OR: [{ status: 'Paid' }, { status: 'Pending' }]
        },
      });

      const thisMonthRevenue = await prisma.order.findMany({
        where: {
          createdAt: {
            gte: currentMonth, // Start of current month
            lt: nextMonth // Start of next month
          },
          status: 'Paid'
      
        },
        select: {
          amount: true,
          price: true
        },
      });

      let currentRevenue = 0;
      thisMonthRevenue.forEach((order) => {
        const order_totals = order.amount * order.price;
        currentRevenue += order_totals;
      }); 

      const thisMonthCustomers = await prisma.order.findMany({
        where: {
          createdAt: {
            gte: currentMonth, // Start of current month
            lt: nextMonth // Start of next month
          },
        },
        distinct: ['userId'] // Retrieve distinct userIds
      });
    return {
      total_orders: result._count._all,
      total_customers: Object.keys(thisMonthCustomers).length,
      total_revenue: currentRevenue,
    };
    }
  catch (error) {
    console.error('Error fetching status:', error);
    throw error;
  }
});


//get company
let CompanyConfig;
ipcMain.handle('fetch-company', async (event, args) => {


  function getOrderBy(args) {
    switch (args) {
      
        case 1:
            
            CompanyConfig =  [
                { createdAt: 'desc' },
                { id: 'desc' },
            ];
            break;
        case 2:
            
          CompanyConfig = [
                { name: 'asc' }
            ];
            break;
  
        case 3:
            
            CompanyConfig = [
                { orders: { _count: 'desc' } }
            ];
            break;
        default:
          if (CompanyConfig == null) {
            CompanyConfig = [{ createdAt: 'desc' }, { id: 'desc' }];
        }
        break;
    }
  }
  getOrderBy(args);

  try {
   
    const companies = await prisma.company.findMany({
      include: {
        
        orders: {
          where: {
            createdAt: {
              gte : ninetyDaysAgo  // Date 90 days ago
            },
            status :{
              not: 'Cancelled',
            }
          },
          select: {
            amount: true,
            price: true,
            status: true,
          },
        },
        _count: {
          select: {orders: true },
        },
        
        
      },
      orderBy: CompanyConfig,
    });

    const companyCounts: { 
      companyId: string, 
      storeName: string,
      paidOrdersCount: number,
      notCancelledOrdersCount: number,
      totalPaid: number,
      StoreBackground : string,
    }[] = [];

    // Iterate through each company
    companies.forEach(company => {
      const companyId = company.id;
      const storeName = company.name; 
      const StoreBackground = company.CompanyBackground;
      // Initialize counts for the current company
      let paidOrdersCount = 0;
      let notCancelledOrdersCount = 0;
      let totalPaid = 0;
    
      // Iterate through each order of the current company
      company.orders.forEach(order => {
        if (order.status === "Paid") {
          // Increment count of paid orders for the current company
          paidOrdersCount++;
    
          // Calculate total for the paid order and add it to the totalPaid
          totalPaid += order.amount * order.price;
        }
        if (order.status !== "Cancelled") {
          // Increment count of not cancelled orders for the current company
          notCancelledOrdersCount++;
        }
      });
    
      // Add the counts to the companyCounts array
      companyCounts.push({ companyId, storeName, paidOrdersCount, notCancelledOrdersCount, totalPaid, StoreBackground});
    });
    return companyCounts;
    
  }

   catch (error) {
    console.error('Error fetching company:', error);
    throw error;
  }
});

ipcMain.handle('fetch-top-company', async (event, args) => {

  try {
   
    const companies = await prisma.company.findMany({
      include: {
        
        orders: {
          where: {
            createdAt: {
              gte : ninetyDaysAgo  // Date 90 days ago
            },
            status :{
              not: 'Cancelled',
            }
          },
          select: {
            amount: true,
            price: true,
            status: true,
          },
        },
        _count: {
          select: {orders: true },
        },
        
        
      },
      orderBy: [
        {
           createdAt: 'desc',
        },
        {
           id: 'desc',
        }
     ],
    });

    const companyCounts: { 
      companyId: string, 
      storeName: string,
      paidOrdersCount: number,
      notCancelledOrdersCount: number,
      totalPaid: number,
      StoreBackground : string,
    }[] = [];

    // Iterate through each company
    companies.forEach(company => {
      const companyId = company.id;
      const storeName = company.name; 
      const StoreBackground = company.CompanyBackground;
      // Initialize counts for the current company
      let paidOrdersCount = 0;
      let notCancelledOrdersCount = 0;
      let totalPaid = 0;
    
      // Iterate through each order of the current company
      company.orders.forEach(order => {
        if (order.status === "Paid") {
          // Increment count of paid orders for the current company
          paidOrdersCount++;
    
          // Calculate total for the paid order and add it to the totalPaid
          totalPaid += order.amount * order.price;
        }
        if (order.status !== "Cancelled") {
          // Increment count of not cancelled orders for the current company
          notCancelledOrdersCount++;
        }
      });
    
      // Add the counts to the companyCounts array
      companyCounts.push({ companyId, storeName, paidOrdersCount, notCancelledOrdersCount, totalPaid, StoreBackground});
    });

    //sort according to orders 
    companyCounts.sort((a, b) => b.paidOrdersCount - a.paidOrdersCount);

    return companyCounts;
  }

  

   catch (error) {
    console.error('Error fetching company:', error);
    throw error;
  }
});



// change status  

ipcMain.handle('change-status', async (event, args) => {
  event;
  try {
    const result = await prisma.order.update({
      where: { id: args.id },
      data: { status: args.status },
    });
    return result ;
   
  } catch (error) {
    console.error('Error changing status:', error);
    throw error;
  }
});

ipcMain.handle('change-status-multiple', async (event, args,status) => {

  try {

          const updatePromises = args.map(async (id) => {
            const result = await prisma.order.update({
                where: { id: id },
                data: { status: status },
            });
            return result;
        });

        // Wait for all update promises to resolve
        const results = await Promise.all(updatePromises);
        return results;
  } catch (error) {
    console.error('Error changing status:', error);
    throw error;
  }
});


// remove orders

ipcMain.handle('remove-orders', async (event, args) => {
  
  try {
    const result = await prisma.order.delete({
      where: { id: args },
    });
    return result ;
  } catch (error) {
    console.error('Error deleting order:', error);
    throw error;
  }
  
});


ipcMain.handle('remove-orders-multiple', async (event, args) => {
  
  try {
      const updatePromises = args.map(async (id) => {
        const result = await prisma.order.delete({
            where: { id: id },
        });
        return result;
    });
    const results = await Promise.all(updatePromises);
    return results;
  } catch (error) {
    console.error('Error deleting order:', error);
    throw error;
  }
  
});


ipcMain.handle('fetch-percentage', async (event, args) => {

  //Orders this month
  try
  {
  const currentMonth  = new Date(new Date().getFullYear(), new Date().getMonth(), 1);
  const lastMonth     = new Date(new Date().getFullYear(), new Date().getMonth() - 1, 1);
  const nextMonth    = new Date(new Date().getFullYear(), new Date().getMonth() + 1, 1);

  
  
  const thisMonthOrders = await prisma.order.count({
    where: {AND: [
      { createdAt: { gte: currentMonth} },
      { createdAt: { lte: nextMonth } },
      { OR: [{ status: 'Paid' }, { status: 'Pending' }] },
    ],
      
    }
  });

  const lastMonthOrders = await prisma.order.count({
    where: {AND: [
      { createdAt: { gte: lastMonth} },
      { createdAt: { lte: currentMonth } },
      { OR: [{ status: 'Paid' }, { status: 'Pending' }] },
    ],
      
    }
  });

  //Customers this month

  const thisMonthCustomers = await prisma.order.findMany({
    where: {
      createdAt: {
        gte: currentMonth, // Start of current month
        lt: nextMonth // Start of next month
      },

    },
    distinct: ['userId'] // Retrieve distinct userIds
  });
  const lastMonthCustomers = await prisma.order.findMany({
    where: {
      createdAt: {
        gte: lastMonth, // Start of last month
        lt: currentMonth // End of last month
      }
    },
    distinct: ['userId'] // Retrieve distinct userIds
  });

  //Revenue this month



const thisMonthRevenue = await prisma.order.findMany({
  where: {
    createdAt: {
      gte: currentMonth, // Start of current month
      lt: nextMonth // Start of next month
    },
    status: 'Paid'

  },
  select: {
    amount: true,
    price: true
  },
});

const lastMonthRevenue = await prisma.order.findMany({
  where: {
    createdAt: {
      gte: lastMonth, // Start of last month
      lt: currentMonth // End of last month
    },
    status: 'Paid'
  },
  select: {
    amount: true,
    price: true
  },
});

let currentRevenue = 0;
let lastRevenue = 0;
thisMonthRevenue.forEach((order) => {
  const order_totals = order.amount * order.price;
  currentRevenue += order_totals;
});

lastMonthRevenue.forEach((order) => {
  const order_totals = order.amount * order.price;
  lastRevenue += order_totals;
});


  const orderPercentageChange = ((thisMonthOrders - lastMonthOrders));
  const customerPercentageChange = ((Object.keys(thisMonthCustomers).length - Object.keys(lastMonthCustomers).length));
  const revenuePercentageChange = ((((currentRevenue - lastRevenue) / lastRevenue * 100).toFixed(2)));
   // Calculate the percentage change in revenue
  return {
    order_percentage_change: orderPercentageChange,
    customer_percentage_change: customerPercentageChange,
    revenuePercentageChange: revenuePercentageChange
  };
}
catch (error) {
  console.error('Error fetching percentage:', error);
  throw error;
}

});

//get all orders
let Config;
let TypeOfOrder;
ipcMain.handle('all-orders', async (event, args) => {

function getOrderBy(args) {
  switch (args) {
    
      case 1:
          
          Config =  [
              { createdAt: 'desc' },
              { id: 'desc' },
          ];
          break;
      case 2:
          
        Config = [
              { user: { name: 'asc' } }
          ];
          break;

      case 3:
          
          Config = [
              { company: { name: 'desc' } }
          ];
          break;
          
      case 4:
          Config = [
              { amount: 'desc' },
              { price: 'desc' },
          ];
          break;
      case 5:
          
          Config = [
              { fabricType: 'asc' },
          ];
          break;
      case 6:
          
          Config = [
              { unit: 'asc' },
          ];
          break;
      default:
        if (Config == null) {
          Config = [{ createdAt: 'desc' }, { id: 'desc' }];
      }
      break;
  }
}
getOrderBy(args);
function Type(args) {
  switch (args) {

      case 7:
          TypeOfOrder = {
              createdAt: {
                  gte: ninetyDaysAgo   // Date 30 days ago
              }
          };
          break;
      case 8:
          TypeOfOrder ={
                  status: 'Paid',
                  createdAt: {
                      gte: ninetyDaysAgo   // Date 90 days ago
                  }
          };
          break;

      case 9:
          TypeOfOrder = {
              status: 'Pending',
              createdAt: {
                  gte: ninetyDaysAgo   // Date 90 days ago
              }
          };
          break;

      case 10:
          TypeOfOrder = {
              status: 'Cancelled',
              createdAt: {
                  gte: ninetyDaysAgo   // Date 90 days ago
              }
          };
          break;

        case 11:
          TypeOfOrder = {
              createdAt: {
                  gte: sexMonthsAgo  // Date 180 days ago
              }
          };
          break;

          case 12:
          TypeOfOrder = {
              createdAt: {
                  gte: yearAgo   // Date 365 days ago
              }
          };
          break;
  
          case 13:
          TypeOfOrder = {
              createdAt: {
                  gte: TwoYearsAgo   // Date 730 days ago
              }
          };
          break;

      default:
         if (TypeOfOrder==null){
              createdAt: {
                  gte: ninetyDaysAgo   // Date 90 days ago
              }
          };
          break;
  }};
  Type(args);

  try {
    const orders = await prisma.order.findMany({
      where: TypeOfOrder,
      orderBy:Config,
      include: {
        user: true,
        company: true
      }

    });
    return orders;
  }
catch (error) {
    console.error('Error fetching users:', error);
    throw error;
  }

});


ipcMain.handle('overview-orders', async (event, args) => {
  try {

    // Count of all orders
    const allOrdersCount = await prisma.order.count({
      where: {
        createdAt: { gte: ninetyDaysAgo }
      }
    });

    // Count of paid orders
    const paidOrdersCount = await prisma.order.count({
      where: {
        status: 'Paid',
        createdAt: { gte: ninetyDaysAgo }
      }
    });

    // Count of pending orders
    const pendingOrdersCount = await prisma.order.count({
      where: {
        status: 'Pending',
        createdAt: { gte: ninetyDaysAgo }
      }
    });

    // Count of cancelled orders
    const cancelledOrdersCount = await prisma.order.count({
      where: {
        status: 'Cancelled',
        createdAt: { gte: ninetyDaysAgo }
      }
  });
  
      return {
        allOrdersCount,
        paidOrdersCount,
        pendingOrdersCount,
        cancelledOrdersCount
      };
}
catch (error) {
    console.error('Error fetching users:', error);
    throw error;
  }

});



let CustomerConfig: any ;
let pervstate = 0;
ipcMain.handle('fetch-customers', async (event, args) => {


  function Type (args:number) {

  switch (args) {
    case 1:
        CustomerConfig =[
          { createdAt: 'desc' },
          { id: 'desc' },
        ];
        pervstate = 1;
        break;

    case 2:
      CustomerConfig = [
          { name: 'asc' }
        ];
        pervstate = 2;
        break;
    case 3:
       CustomerConfig = [
        {
          orders: {
            _count: 'desc'
            
          }
        }
      ];
      pervstate = 3;
        break;
    default:
      if (CustomerConfig == null) {
        CustomerConfig = [{ createdAt: 'desc' }, { id: 'desc' }];
    }
    break;
}
  }

Type(args);
  try {
    const customers = await prisma.user.findMany({
      include: {
        orders: {
          where: {
            createdAt: {
              gte: ninetyDaysAgo// Date 180 days ago
            },
            status: {
              not: 'Cancelled'
            }
          },
        }
      },
      orderBy: CustomerConfig,
    
    });
    if (pervstate == 3) {
      customers.sort((a, b) => b.orders.length - a.orders.length);
    }
    return customers;
  }
  
  
catch (error) {
    console.error('Error fetching users:', error);
    throw error;
  }

});

ipcMain.handle('CustomerOrders', async (event, args) => {
  try {
   const CustomerOrders = await prisma.order.findMany({
      where: {
        userId: args,
        createdAt: {
          gte: sexMonthsAgo
        }
      },
      include: {
        user: true,
        company: true
      },
      orderBy: [
        {
           createdAt: 'desc',
        },
        {
           id: 'desc',
        }
      ],
    });
    return CustomerOrders;
  }
  
catch (error) {
    console.error('Error fetching users:', error);
    throw error;
  }

});


ipcMain.handle('get-customer', async (event, args) => {


  try {
    const customer = await prisma.user.findFirst({
      where: {
        id: args
      }
    });
    return customer;
  }
  
catch (error) {
    console.error('Error fetching users:', error);
    throw error;
  }
});



ipcMain.handle('fetch-overview', async (event, args) => {
  try {
   const CustomerPaidOrders = await prisma.order.aggregate({
    where: {
      userId: args,
      status: "Paid",
      createdAt: {
        gte: ninetyDaysAgo // Date 90 days ago  
      }
    },
    _count: true
    
    });
    const CustomerPendingOrders = await prisma.order.aggregate({
      where: {
        userId: args,
        status: "Pending",
        createdAt: {
          gte: ninetyDaysAgo // Date 90 days ago
        }
      },
      _count: true
      
      });
    return {
      CustomerPaidOrders,
      CustomerPendingOrders
    };
  }
  
catch (error) {
    console.error('Error fetching users:', error);
    throw error;
  }

});

ipcMain.handle('customer-status', async (event, args) => {

  const currentMonth  = new Date(new Date().getFullYear(), new Date().getMonth(), 1);
  const lastThreeMonths = new Date(new Date().getFullYear(), new Date().getMonth() - 3, 1);
  const nextThreeMonths    = new Date(new Date().getFullYear(), new Date().getMonth() + 3, 1);
 

  try {

 const AllOrdersCurrentRevenue = await prisma.order.findMany({
    where: {
      userId: args,
      createdAt: {
        gte: currentMonth, // Start of current month
        lt: nextThreeMonths // Start of next month
      },
     status:{ not: 'Cancelled' },

      
      
    },
    select: {
      amount: true,
      price: true
    },
  });

  const AllOrdersLastRevenue = await prisma.order.findMany({
    where: {
      userId: args,
      createdAt: {
        gte: lastThreeMonths, // Start of last month
        lt: currentMonth // End of last month
      },
      status:{ not: 'Cancelled' },
    },
    select: {
      amount: true,
      price: true
    },
  });

   const PaidOrdersCurrentRevenue = await prisma.order.findMany({
      where: {
        userId: args,
        createdAt: {
          gte: currentMonth, // Start of current month
          lt: nextThreeMonths // Start of next month
        },
        
        status: 'Paid'
      },
      select: {
        amount: true,
        price: true
      },

  });
  const PaidOrdersLastRevenue = await prisma.order.findMany({
    where: {
      userId: args,
      createdAt: {
        gte: lastThreeMonths, // Start of last month
        lt: currentMonth // End of last month
      },
      
      status: 'Paid'
    },
    select: {
      amount: true,
      price: true
    },
  });

  const PendingOrdersCurrentRevenue = await prisma.order.findMany({
    where: {
      userId: args,
      createdAt: {
        gte: currentMonth, // Start of current month
        lt: nextThreeMonths // Start of next month
      },
      
      status: 'Pending',
      
    },
    select: {
      amount: true,
      price: true
    },
  });

  const PendingOrdersLastRevenue = await prisma.order.findMany({
    where: {
      userId: args,
      createdAt: {
        gte: lastThreeMonths, // Start of last month
        lt: currentMonth // End of last month
      },
      
      status: 'Pending'
    },
    select: {
      amount: true,
      price: true
    },
  });

  const ThisMonthAmount = await prisma.order.findMany({
    where: {
      userId: args,
      createdAt: {
        gte: currentMonth, // Start of current month
        lt: nextThreeMonths // Start of next month
      },
      status:"Paid",
      
    },
    select: {
      amount: true,
    },
  });

  const LastMonthAmount = await prisma.order.findMany({
    where: {
      userId: args,
      createdAt: {
        gte: lastThreeMonths, // Start of last month
        lt: currentMonth // End of last month
      },
      status:"Paid",
      
    },
    select: {
      amount: true,
    },
  });



// Calculate the percentage change in revenue

//All orders

let AllRevenue:number = 0;
let lastRevenue = 0;
AllOrdersCurrentRevenue.forEach((order) => {
  const order_totals = order.amount * order.price;
  AllRevenue += order_totals;
});

AllOrdersLastRevenue.forEach((order) => {
  const order_totals = order.amount * order.price;
  lastRevenue += order_totals;
});

//Paid orders
let PaidRevenue:number = 0;
let lastPaidRevenue = 0;
PaidOrdersCurrentRevenue.forEach((order) => {
  const order_totals = order.amount * order.price;
  PaidRevenue += order_totals;
});

PaidOrdersLastRevenue.forEach((order) => {
  const order_totals = order.amount * order.price;
  lastPaidRevenue += order_totals;
});

//Pending orders  

let PendingRevenue = 0;
let lastPendingRevenue = 0;
PendingOrdersCurrentRevenue.forEach((order) => {
  const order_totals = order.amount * order.price;
  PendingRevenue += order_totals;
});

PendingOrdersLastRevenue.forEach((order) => {
  const order_totals = order.amount * order.price;
  lastPendingRevenue += order_totals;
});



let TotalAmount=0;
ThisMonthAmount.forEach((order) => {
  TotalAmount += order.amount;
});
let LastAmount=0;
LastMonthAmount.forEach((order) => {
  LastAmount += order.amount;
});





// Calculate the percentage change in revenue



const AllOrderPercentageChange = ((((AllRevenue - lastRevenue) / lastRevenue) * 100).toFixed(2));
const PaidOrderPercentageChange = ((((PaidRevenue - lastPaidRevenue) / lastPaidRevenue) * 100).toFixed(2));
const PendingOrderPercentageChange = ((((PendingRevenue - lastPendingRevenue) / lastPendingRevenue) * 100).toFixed(2));
const TotalAmountPercentageChange = ((((TotalAmount - LastAmount) / LastAmount) * 100).toFixed(2));




const formattedAllRevenue: string = AllRevenue.toFixed(2);
const formattedPaidRevenue: string = PaidRevenue.toFixed(2);
const formattedPendingRevenue: string = PendingRevenue.toFixed(2);
const formattedTotalAmount: string = TotalAmount.toFixed(2);
      return {
        
        AllOrderPercentageChange,
        PaidOrderPercentageChange,
        PendingOrderPercentageChange,
        TotalAmountPercentageChange,
        formattedAllRevenue,
        formattedPaidRevenue,
        formattedPendingRevenue,
        formattedTotalAmount
      };



  }
  
catch (error) {
    console.error('Error fetching users:', error);
    throw error;
  }

});

ipcMain.handle("add-customer", async (event, args) => {

  args.address = args.address || "null";
  args.phone = args.phone || "null";
  args.company = args.company || "null";  
  const currentDateISO = new Date().toISOString();
  const UserBackground = Math.floor(Math.random() * 11).toString();
  try {
    const result = await prisma.user.create({
      data: {
        name: args.user,
        phone: args.phone,
        Address: args.address,
        createdAt: currentDateISO,
        UserBackground: UserBackground,
        StoreName: args.company,
        CompanyID:"Null"
      },
    });
    return result;
  } catch (error) {
    console.error("Error creating user:", error);
    throw error;
  }
});

ipcMain.handle("fetch-All", async (event, args) => {
  try {
    const users = await prisma.user.findMany();
    const companies = await prisma.company.findMany();
    const fabricType = await prisma.order.findMany({
      distinct: ['fabricType'],
      select: {
        fabricType: true
      }
    });
    return {
      users,
      companies,
      fabricType
    };
    }
    catch (error) {
    console.error("Error fetching users:", error);
    throw error;
  }
}
);


ipcMain.handle("fetch-customer-name", async (event, args) => {
  try {
    const result = await prisma.user.findFirst({
      where: {
        id: args
      },
      select: {
        name: true
      }
    });
    return result;
  } catch (error) {
    console.error("Error fetching users:", error);
    throw error;
  }
});

ipcMain.handle("fetch-stores", async (event, args) => {
  try {
    const result = await prisma.company.findMany();
    return result;
  } catch (error) {
    console.error("Error fetching users:", error);
    throw error;
  }
});

ipcMain.handle("fetch-top-customers", async (event, args) => {
  try {
    const result = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        UserBackground: true,
        orders: {
          where: {
           createdAt: {
            gte: thirtyDaysAgo
           },
            status: {
              not: 'Cancelled'
            }
          },
          select: {
            amount: true,
            price: true,
            
          },
        },
        
        // Other user fields you need
      
        _count: {
          select: {orders: true },
           // Count non-cancelled orders within 30 days
        },
        
      },

      where: {
        orders: {
          some: { // Use "some" operator to check for at least one matching order
           createdAt: {
            gte: thirtyDaysAgo
           },
            status: { not: 'Cancelled' }, // Exclude cancelled orders
          },
        },
      },
      
    });
    let Sorted = result.sort((a, b) => b.orders.length - a.orders.length);

    //if they have the same number of orders, sort by the total amount
    return Sorted;
  } catch (error) {
    console.error("Error fetching users:", error);
    throw error;
  }
});


ipcMain.handle("fetch-company-info", async (event, args) => {


  try {
   
    const Company = await prisma.company.findFirst({

      where: {
        id: args
      },
      include: {
        orders: {
          where: {
            createdAt: {
              gte: sexMonthsAgo
            },
            status:"Paid"
          },
          select: {
            amount: true,
            price: true,
          },
        },
      },
     
    });

    const CompanyOrder = await prisma.company.findFirst({

      where: {
        id: args
      },
      include: {
        orders: {
          where: {
            createdAt: {
              gte: ninetyDaysAgo// Date 180 days ago
            },
            status:{
              not: 'Cancelled',
            }
          },
          select: {
            amount: true,
            price: true,
          },
        },
      },
     
    });
    
let TotalAmount = 0;
    Company?.orders.forEach((order) => {
      const order_totals = order.amount * order.price;
      TotalAmount += order_totals;
    }); 
    const formatedAmount:string = TotalAmount.toFixed(2);
    const formattedPrice = `$${formatedAmount.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}`;
    return {
      Name: Company?.name,
      Phone: Company?.phone,
      Address: Company?.Address,
      TotalAmount: formattedPrice,
      Orders: CompanyOrder?.orders.length,
      CompanyBackground: Company?.CompanyBackground
    };
    
  } catch (error) {
    console.error("Error fetching users:", error);
    throw error;
  }
});


ipcMain.handle("fetch-company-status", async (event, args) => {
  const currentMonth  = new Date(new Date().getFullYear(), new Date().getMonth(), 1);
  const nextThreeMonths    = new Date(new Date().getFullYear(), new Date().getMonth() + 3, 1);
  const ThreeMonthsAgo = new Date(new Date().getFullYear(), new Date().getMonth() - 3, 1);
  try {
    const ThisQuarterPendingRevenue = await prisma.company.findFirst({
      where: {
        id: args
      },
      include: {
        orders: {
          where: {
            createdAt: {
              gte: currentMonth, // Start of current month
              lt: nextThreeMonths // Start of next month
            },
            status: "Pending"
          },
          select: {
            amount: true,
            price: true,
          },
        },
      },
 
    });

    const LastQuarterPendingRevenue = await prisma.company.findFirst({
      where: {
        id: args
      },
      include: {
        orders: {
          where: {
            createdAt: {
              gte: ThreeMonthsAgo,
              lt: currentMonth,
            },
            status: "Pending"
          },
          select: {
            amount: true,
            price: true,
          },
        },
      },
 
    });

    const ThisQuarterPaidRevenue = await prisma.company.findFirst({
      where: {
        id: args
      },
      include: {
        orders: {
          where: {
            createdAt: {
              gte: currentMonth, // Start of current month
              lt: nextThreeMonths // Start of next month
            },
            status: "Paid"
          },
          select: {
            amount: true,
            price: true,
          },
        },
      },
 
    });

    const LastQuarterPaidRevenue = await prisma.company.findFirst({
      where: {
        id: args
      },
      include: {
        orders: {
          where: {
            createdAt: {
              gte: ThreeMonthsAgo,
              lt: currentMonth,
            },
            status: "Paid"
          },
          select: {
            amount: true,
            price: true,
          },
        },
      },
 
    });


    let ThisQuarterPending = 0;
    let LastQuarterPending = 0;
    let ThisQuarterPaid = 0;
    let LastQuarterPaid = 0;

    ThisQuarterPendingRevenue?.orders.forEach((order) => {
      const order_totals = order.amount * order.price;
      ThisQuarterPending += order_totals;
    });

    LastQuarterPendingRevenue?.orders.forEach((order) => {
      const order_totals = order.amount * order.price;
      LastQuarterPending += order_totals;
    });

    ThisQuarterPaidRevenue?.orders.forEach((order) => {
      const order_totals = order.amount * order.price;
      ThisQuarterPaid += order_totals;
    });

    LastQuarterPaidRevenue?.orders.forEach((order) => {
      const order_totals = order.amount * order.price;
      LastQuarterPaid += order_totals;
    });


    //calculate the percentage change in revenue

    let PendingPercentageChange = ((((ThisQuarterPending - LastQuarterPending) / LastQuarterPending) * 100).toFixed(2));
    let PaidPercentageChange = (((ThisQuarterPaid - LastQuarterPaid / LastQuarterPaid) * 100).toFixed(2));

    let formattedThisQuarterPending = ThisQuarterPending.toFixed(2);
    let formattedLastQuarterPending = LastQuarterPending.toFixed(2);
    let formattedThisQuarterPaid = ThisQuarterPaid.toFixed(2);
    let formattedLastQuarterPaid = LastQuarterPaid.toFixed(2);



    formattedThisQuarterPaid = `$${formattedThisQuarterPaid.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}`;
    formattedThisQuarterPending = `$${formattedThisQuarterPending.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}`;
 
    if (PendingPercentageChange.length > 4) {
      PendingPercentageChange = PendingPercentageChange.slice(0, 5);
    }
    if (PaidPercentageChange.length > 4) {
      PaidPercentageChange = PaidPercentageChange.slice(0, 5);
    }

   

    return {
      PendingPercentageChange,
      PaidPercentageChange,
      formattedThisQuarterPending,
      formattedLastQuarterPending,
      formattedThisQuarterPaid,
      formattedLastQuarterPaid
    };
    
  } catch (error) {
    console.error("Error fetching users:", error);
    throw error;
  }
}
);

ipcMain.handle("fetch-company-orders", async (event, args) => {
  try {
    const CompanyOrders = await prisma.company.findFirst({
      where: {
        id: args
      },
      include: {
        orders: {
          include: {
            user: true
          },
          where: {
            
            companyId: args,
            createdAt: {
              gte: ninetyDaysAgo// Date 180 days ago
            },
            
          },
          orderBy: [
            {
               createdAt: 'desc',
            },
            {
               id: 'desc',
            }
          ],
        },
      },
 
    });
    return {

      Orders: CompanyOrders?.orders,
    }
  } catch (error) {
    console.error("Error fetching users:", error);
    throw error;
  }
});

ipcMain.handle("fetch-company-name1", async (event, args) => {
  try {
    const result = await prisma.company.findFirst({
      where: {
        id: args
      },
      select: {
        name: true
      }
    });
    return result;
  } catch (error) {
    console.error("Error fetching users:", error);
    throw error;
  }
});

ipcMain.handle("add-company", async (event, args) => {  
  args.address = args.address || "null";
  args.phone = args.phone || "null";
  const currentDateISO = new Date().toISOString();
  const CompanyBackground = Math.floor(Math.random() * 11).toString();
  try {
    const result = await prisma.company.create({
      data: {
        name: args.name,
        phone: args.phone,
        Address: args.address,
        createdAt: currentDateISO,
        CompanyBackground: CompanyBackground
      },
    });
    return result;
  } catch (error) {
    console.error("Error creating user:", error);
    throw error;
  }
});

ipcMain.handle("fetch-company-count", async (event, args) => {
  try {
    const result = await prisma.company.count();
    return result;
  } catch (error) {
    console.error("Error fetching users:", error);
    throw error;
  }
});


ipcMain.handle("fetch-analytics", async (event, args) => {

  const currentMonth  = new Date(new Date().getFullYear(), new Date().getMonth(), 1);
  const lastMonth     = new Date(new Date().getFullYear(), new Date().getMonth() - 1, 1);
  const TwoMonthsAgo = new Date(new Date().getFullYear(), new Date().getMonth() - 2, 1);
  const ThreeMonthsAgo = new Date(new Date().getFullYear(), new Date().getMonth() - 3, 1);
  const FourMonthsAgo = new Date(new Date().getFullYear(), new Date().getMonth() - 4, 1);
  const FiveMonthsAgo = new Date(new Date().getFullYear(), new Date().getMonth() - 5, 1);

  try {
    const PaidOrdersThisMonth = await prisma.company.findUnique({
      where: {
        id: args
      },
      include: {
        orders: {
          where: {
            createdAt: {
              gte: currentMonth
            },
            status: "Paid"
          },
          select: {
            amount: true,
            price: true,
          },
        },
      },
    });

    const PaidOrdersLastMonth = await prisma.company.findUnique({
      where: {
        id: args
      },
      include: {
        orders: {
          where: {
            createdAt: {
              gte: lastMonth,
              lt: currentMonth
            },
            status: "Paid"
          },
          select: {
            amount: true,
            price: true,
          },
        },
      },
    });

    const PaidOrdersTwoMonthsAgo = await prisma.company.findUnique({
      where: {
        id: args
      },
      include: {
        orders: {
          where: {
            createdAt: {
              gte: TwoMonthsAgo,
              lt: lastMonth
            },
            status: "Paid"
          },
          select: {
            amount: true,
            price: true,
          },
        },
      },
    });

    const PaidOrdersThreeMonthsAgo = await prisma.company.findUnique({
      where: {
        id: args
      },
      include: {
        orders: {
          where: {
            createdAt: {
              gte: ThreeMonthsAgo,
              lt: TwoMonthsAgo
            },
            status: "Paid"
          },
          select: {
            amount: true,
            price: true,
          },
        },
      },
    });

    const PaidOrdersFourMonthsAgo = await prisma.company.findUnique({
      where: {
        id: args
      },
      include: {
        orders: {
          where: {
            createdAt: {
              gte: FourMonthsAgo,
              lt: ThreeMonthsAgo
            },
            status: "Paid"
          },
          select: {
            amount: true,
            price: true,
          },
        },
      },
    });

    const PaidOrdersFiveMonthsAgo = await prisma.company.findUnique({
      where: {
        id: args
      },
      include: {
        orders: {
          where: {
            createdAt: {
              gte: FiveMonthsAgo,
              lt: FourMonthsAgo
            },
            status: "Paid"
          },
          select: {
            amount: true,
            price: true,
          },
        },
      },
    });

    const PendingOrdersThisMonth = await prisma.company.findUnique({
      where: {
        id: args
      },
      include: {
        orders: {
          where: {
            createdAt: {
              gte: currentMonth
            },
            status: "Pending"
          },
          select: {
            amount: true,
            price: true,
          },
        },
      },
    });

    const PendingOrdersLastMonth = await prisma.company.findUnique({
      where: {
        id: args
      },
      include: {
        orders: {
          where: {
            createdAt: {
              gte: lastMonth,
              lt: currentMonth
            },
            status: "Pending"
          },
          select: {
            amount: true,
            price: true,
          },
        },
      },
    });

    const PendingOrdersTwoMonthsAgo = await prisma.company.findUnique({
      where: {
        id: args
      },
      include: {
        orders: {
          where: {
            createdAt: {
              gte: TwoMonthsAgo,
              lt: lastMonth
            },
            status: "Pending"
          },
          select: {
            amount: true,
            price: true,
          },
        },
      },
    });

    const PendingOrdersThreeMonthsAgo = await prisma.company.findUnique({
      where: {
        id: args
      },
      include: {
        orders: {
          where: {
            createdAt: {
              gte: ThreeMonthsAgo,
              lt: TwoMonthsAgo
            },
            status: "Pending"
          },
          select: {
            amount: true,
            price: true,
          },
        },
      },
    });

    const PendingOrdersFourMonthsAgo = await prisma.company.findUnique({
      where: {
        id: args
      },
      include: {
        orders: {
          where: {
            createdAt: {
              gte: FourMonthsAgo,
              lt: ThreeMonthsAgo
            },
            status: "Pending"
          },
          select: {
            amount: true,
            price: true,
          },
        },
      },
    });

    const PendingOrdersFiveMonthsAgo = await prisma.company.findUnique({
      where: {
        id: args
      },
      include: {
        orders: {
          where: {
            createdAt: {
              gte: FiveMonthsAgo,
              lt: FourMonthsAgo
            },
            status: "Pending"
          },
          select: {
            amount: true,
            price: true,
          },
        },
      },
    });


    let ThisMonthPaid = 0;
    let LastMonthPaid = 0;
    let TwoMonthsAgoPaid = 0;
    let ThreeMonthsAgoPaid = 0;
    let FourMonthsAgoPaid = 0;
    let FiveMonthsAgoPaid = 0;

    let ThisMonthPending = 0;
    let LastMonthPending = 0;
    let TwoMonthsAgoPending = 0;
    let ThreeMonthsAgoPending = 0;
    let FourMonthsAgoPending = 0;
    let FiveMonthsAgoPending = 0;

    PaidOrdersThisMonth?.orders.forEach((order) => {
      const order_totals = order.amount * order.price;
      ThisMonthPaid += order_totals;
    });

    PaidOrdersLastMonth?.orders.forEach((order) => {
      const order_totals = order.amount * order.price;
      LastMonthPaid += order_totals;
    });

    PaidOrdersTwoMonthsAgo?.orders.forEach((order) => {
      const order_totals = order.amount * order.price;
      TwoMonthsAgoPaid += order_totals;
    });

    PaidOrdersThreeMonthsAgo?.orders.forEach((order) => {
      const order_totals = order.amount * order.price;
      ThreeMonthsAgoPaid += order_totals;
    });

    PaidOrdersFourMonthsAgo?.orders.forEach((order) => {
      const order_totals = order.amount * order.price;
      FourMonthsAgoPaid += order_totals;
    });

    PaidOrdersFiveMonthsAgo?.orders.forEach((order) => {
      const order_totals = order.amount * order.price;
      FiveMonthsAgoPaid += order_totals;
    });

    PendingOrdersThisMonth?.orders.forEach((order) => {
      const order_totals = order.amount * order.price;
      ThisMonthPending += order_totals;
    });

    PendingOrdersLastMonth?.orders.forEach((order) => {
      const order_totals = order.amount * order.price;
      LastMonthPending += order_totals;
    });

    PendingOrdersTwoMonthsAgo?.orders.forEach((order) => {
      const order_totals = order.amount * order.price;
      TwoMonthsAgoPending += order_totals;
    });

    PendingOrdersThreeMonthsAgo?.orders.forEach((order) => {
      const order_totals = order.amount * order.price;
      ThreeMonthsAgoPending += order_totals;
    });

    PendingOrdersFourMonthsAgo?.orders.forEach((order) => {
      const order_totals = order.amount * order.price;
      FourMonthsAgoPending += order_totals;
    });

    PendingOrdersFiveMonthsAgo?.orders.forEach((order) => {
      const order_totals = order.amount * order.price;
      FiveMonthsAgoPending += order_totals;
    });


    ThisMonthPaid= parseInt(ThisMonthPaid.toFixed(2))
    LastMonthPaid = parseInt(LastMonthPaid.toFixed(2))
    TwoMonthsAgoPaid = parseInt(TwoMonthsAgoPaid.toFixed(2))
    ThreeMonthsAgoPaid = parseInt(ThreeMonthsAgoPaid.toFixed(2))
    FourMonthsAgoPaid = parseInt(FourMonthsAgoPaid.toFixed(2))
    FiveMonthsAgoPaid = parseInt(FiveMonthsAgoPaid.toFixed(2))
    ThisMonthPending = parseInt(ThisMonthPending.toFixed(2))
    LastMonthPending = parseInt(LastMonthPending.toFixed(2))
    TwoMonthsAgoPending = parseInt(TwoMonthsAgoPending.toFixed(2))
    ThreeMonthsAgoPending = parseInt(ThreeMonthsAgoPending.toFixed(2))
    FourMonthsAgoPending = parseInt(FourMonthsAgoPending.toFixed(2))
    FiveMonthsAgoPending = parseInt(FiveMonthsAgoPending.toFixed(2))
   

    //find Max for all 
    let MaxAll = Math.max(
      ThisMonthPaid,
      LastMonthPaid,
      TwoMonthsAgoPaid,
      ThreeMonthsAgoPaid,
      FourMonthsAgoPaid,
      FiveMonthsAgoPaid,
      ThisMonthPending,
      LastMonthPending,
      TwoMonthsAgoPending,
      ThreeMonthsAgoPending,
      FourMonthsAgoPending,
      FiveMonthsAgoPending);
      MaxAll = parseInt(MaxAll.toFixed(2))
    return {
      ThisMonthPaid,
      LastMonthPaid,
      TwoMonthsAgoPaid,
      ThreeMonthsAgoPaid,
      FourMonthsAgoPaid,
      FiveMonthsAgoPaid,
      ThisMonthPending,
      LastMonthPending,
      TwoMonthsAgoPending,
      ThreeMonthsAgoPending,
      FourMonthsAgoPending,
      FiveMonthsAgoPending,
      MaxAll,
    };

    
  } catch (error) {
    console.error("Error fetching users:", error);
    throw error;
  }
});

ipcMain.handle("fetch-order",async (event, args) => {
  try {
    const result = await prisma.order.findUnique({
      where: {
        id: args
      },
      include: {
        user: true,
        company: true
      }
    });
    return {
      OrderID:result?.id,
      User:result?.user.name,
      Company:result?.company.name,
      Amount:result?.amount,
      Price:result?.price,
      FabricType:result?.fabricType,
      Unit:result?.unit,
      Status:result?.status,
      CreatedAt:formatDate(result?.createdAt),
    }
  } catch (error) {
    console.error("Error fetching users:", error);
    throw error;
  }
});

ipcMain.handle("edit-order", async (event, args) => {

  const randomNumebr = Math.floor(Math.random() * 11).toString();

  const dateStr = args.CreatedAt;
  const formattedDate = new Date(dateStr);
  const formattedDateOrder = formattedDate.toISOString();

  const CurrentDate = new Date();
  const formattedDateStr = new Date(CurrentDate).toISOString();

  try {

    let user = await prisma.user.findFirst({
      where: {
          name: args.User, // Replace with the customer's name
      },
  });
  let company = await prisma.company.findFirst({
    where: {
      name: args.Company, // Replace with the customer's name
    },
});

  // If the user doesn't exist, create a new user
  if (!user) {
      // Create the new user
      user = await prisma.user.create({
          data: {
              name: args.User,
              phone:"null", // Replace with the customer's name
              createdAt:formattedDateStr,
              UserBackground:randomNumebr,
              Address:"null",
              StoreName:"null",
              CompanyID:"null" // Other user properties if applicable
          },
      });
  }

  if (!company) {
    // Create the new user
    company = await prisma.company.create({
        data: {
            name: args.Company,
            phone:"null",
            createdAt:formattedDateStr,
            Address:"null",
            CompanyBackground :randomNumebr,       // Replace with the customer's name
                            // Other user properties if applicable
        },
    });
}

   const result = await prisma.order.update({
      where: {
        id: args.OrderID
      },
      data: {
        amount: args.Amount,
        price: args.Price,
        fabricType: args.FabricType,
        unit: args.Unit,
        status: args.Status,
        user :{
          connect: {id: user.id}
        },
        company: {
          connect: {id: company.id}
        },
        createdAt: formattedDateOrder,
      }
    });


    
     return result;
  } catch (error) {
    console.error("Error fetching users:", error);
    throw error;
  }
});


ipcMain.handle("get-company-details", async (event, args) => {

  try {
    const result = await prisma.company.findFirst({
      where: {
        id: args
      },
      select: {
        id: true,
        name: true,
        phone: true,
        Address: true,
        CompanyBackground: true,
        createdAt: true,
      }
    });
    return {
      CompanyID: result?.id,
      Name: result?.name,
      Phone: result?.phone,
      Address: result?.Address,
      CompanyBackground: result?.CompanyBackground,
      CreatedAt: formatDate(result?.createdAt),
      
    };
    
  } catch (error) {
    console.error("Error fetching users:", error);
    throw error;
  }
});

ipcMain.handle("edit-company", async (event, args) => { 
  console.log(args);
  try {
    const result = await prisma.company.update({
      where: {
        id: args.CompanyID
      },
      data: {
        name: args.Name,
        phone: args.Phone,
        Address: args.Address
      }
    });
    return result;
  } catch (error) {
    console.error("Error fetching users:", error);
    throw error;
  }
});


ipcMain.handle("delete-company", async (event, args) => {
  try {

    //check if the company has any orders

    const CompanyOrders = await prisma.order.findMany({
      where: {
        companyId: args
      }
    });

    //delete all company orders
    if (CompanyOrders.length > 0) {
      CompanyOrders.forEach(async (order) => {
        await prisma.order.delete({
          where: {
            id: order.id
          }
        });
      });
    }
    const result = await prisma.company.delete({
      where: {
        id: args
      }
    });
    return result;
  } catch (error) {
    console.error("Error fetching users:", error);
    throw error;
  }
});

ipcMain.handle("get-customer-details",async (event, args) => {
  try {
    const result = await prisma.user.findFirst({
      where: {
        id: args
      },
      select: {
        id: true,
        name: true,
        phone: true,
        Address: true,
        UserBackground: true,
        createdAt: true,
        StoreName: true
      }
    });
    return {
      CustomerID: result?.id,
      Name: result?.name,
      Phone: result?.phone,
      Address: result?.Address,
      CustomerBackground: result?.UserBackground,
      CreatedAt: formatDate(result?.createdAt),
      Store: result?.StoreName  
    };
  } catch (error) {
    console.error("Error fetching users:", error);
    throw error;
  }
});


ipcMain.handle("edit-customer", async (event, args) => {
  try {
    const result = await prisma.user.update({
      where: {
        id: args.CustomerID
      },
      data: {
        name: args.Name,
        phone: args.Phone,
        Address: args.Address,
        StoreName: args.Store
      }
    });
    return result;
  } catch (error) {
    console.error("Error fetching users:", error);
    throw error;
  }
});

ipcMain.handle("delete-customer", async (event, args) => {

  //check if the customer has any orders



  try {

      
  const CustomerOrders = await prisma.order.findMany({
    where: {
      userId: args
    }
  });
  //delete all company orders
  if (CustomerOrders.length > 0) {
    CustomerOrders.forEach(async (order) => {
      await prisma.order.delete({
        where: {
          id : order.id
        }
      });
    });
  }
    const result = await prisma.user.delete({
      where: {
        id: args
      }
    });
    return result;
  } catch (error) {
    console.error("Error fetching users:", error);
    throw error;
  }
});

function formatDate(date) {
  var d = new Date(date),
      month = '' + (d.getMonth() + 1),
      day = '' + d.getDate(),
      year = d.getFullYear();

  if (month.length < 2) 
      month = '0' + month;
  if (day.length < 2) 
      day = '0' + day;

  return [year, month, day].join('-');
}


