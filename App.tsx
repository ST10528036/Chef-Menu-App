import React, { useState, useMemo } from 'react';
import { 
  Utensils, Search, Plus, Edit3, Trash2, BarChart2, 
  ArrowLeft, Check, X, AlertTriangle, Filter, DollarSign, BookOpen, Layers
} from 'lucide-react';

const INITIAL_MENU_ITEMS = [
  {
    id: '1',
    name: 'Chicken Wings',
    description: 'Crispy spicy wings served with dipping sauce',
    course: 'Starter',
    price: 85.00
  },
  {
    id: '2',
    name: 'Beef Burger Home Made',
    description: 'Juicy 100% pure beef patty with cheese and fries',
    course: 'Main Course',
    price: 120.00
  },
  {
    id: '3',
    name: 'Greek Salad',
    description: 'Fresh crisp lettuce, olives, feta cheese and dressing',
    course: 'Starter',
    price: 65.00
  },
  {
    id: '4',
    name: 'Chocolate Lava Cake',
    description: 'Warm molten chocolate cake with vanilla ice cream',
    course: 'Dessert',
    price: 75.00
  }
];

const COURSES = ['Starter', 'Main Course', 'Dessert'];

export default function App() {
  const [menuItems, setMenuItems] = useState(INITIAL_MENU_ITEMS);
  const [currentScreen, setCurrentScreen] = useState('menu'); // 'menu', 'add', 'edit', 'delete', 'stats'
  const [selectedItem, setSelectedItem] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCourseFilter, setSelectedCourseFilter] = useState('All');
  const [notification, setNotification] = useState(null);

  // Form states
  const [formData, setFormData] = useState({ name: '', description: '', course: 'Starter', price: '' });
  const [formError, setFormError] = useState('');

  const showNotification = (message, type = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3500);
  };

  const filteredItems = useMemo(() => {
    return menuItems.filter(item => {
      const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCourse = selectedCourseFilter === 'All' || item.course === selectedCourseFilter;
      return matchesSearch && matchesCourse;
    });
  }, [menuItems, searchTerm, selectedCourseFilter]);

  const stats = useMemo(() => {
    const total = menuItems.length;
    const starters = menuItems.filter(i => i.course === 'Starter').length;
    const mains = menuItems.filter(i => i.course === 'Main Course').length;
    const desserts = menuItems.filter(i => i.course === 'Dessert').length;
    const totalPrice = menuItems.reduce((acc, curr) => acc + curr.price, 0);
    const avgPrice = total > 0 ? (totalPrice / total).toFixed(2) : '0.00';
    return { total, starters, mains, desserts, avgPrice };
  }, [menuItems]);

  const validateForm = () => {
    if (!formData.name.trim()) return 'Dish name is required.';
    if (!formData.description.trim()) return 'Description is required.';
    if (!formData.course) return 'Please select a course.';
    const priceNum = parseFloat(formData.price);
    if (isNaN(priceNum) || priceNum <= 0) return 'Please enter a valid positive price.';
    return null;
  };

  const handleSaveNewItem = (e) => {
    e.preventDefault();
    const error = validateForm();
    if (error) {
      setFormError(error);
      return;
    }

    const newItem = {
      id: Date.now().toString(),
      name: formData.name.trim(),
      description: formData.description.trim(),
      course: formData.course,
      price: parseFloat(formData.price)
    };

    setMenuItems([newItem, ...menuItems]);
    showNotification('Menu item successfully added!');
    setCurrentScreen('menu');
  };

  const handleUpdateItem = (e) => {
    e.preventDefault();
    const error = validateForm();
    if (error) {
      setFormError(error);
      return;
    }

    setMenuItems(menuItems.map(item => item.id === selectedItem.id ? {
      ...item,
      name: formData.name.trim(),
      description: formData.description.trim(),
      course: formData.course,
      price: parseFloat(formData.price)
    } : item));

    showNotification('Menu item updated successfully!');
    setCurrentScreen('menu');
  };

  const handleDeleteConfirmed = () => {
    if (!selectedItem) return;
    setMenuItems(menuItems.filter(item => item.id !== selectedItem.id));
    showNotification('Menu item deleted.', 'error');
    setCurrentScreen('menu');
    setSelectedItem(null);
  };

  const renderScreen1 = () => (
    <div className="flex flex-col h-full bg-amber-50/50">
      {/* Header */}
      <div className="bg-amber-800 text-white p-4 shadow-md flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <Utensils className="w-6 h-6 text-amber-200" />
          <h1 className="text-xl font-bold tracking-wide">Restaurant Menu</h1>
        </div>
        <button 
          onClick={() => setCurrentScreen('stats')}
          className="flex items-center space-x-1 bg-amber-700 hover:bg-amber-600 text-amber-100 px-3 py-1.5 rounded-lg text-sm font-medium transition shadow-sm"
        >
          <BarChart2 className="w-4 h-4" />
          <span>Stats</span>
        </button>
      </div>

      <div className="p-4 flex-1 flex flex-col max-w-xl w-full mx-auto space-y-4 overflow-y-auto">
        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-3.5 top-3.5 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="search menu items..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-11 pr-10 py-3 bg-white border border-gray-300 rounded-xl shadow-sm focus:ring-2 focus:ring-amber-600 focus:outline-none text-gray-800 placeholder-gray-400"
          />
          {searchTerm && (
            <button 
              onClick={() => setSearchTerm('')}
              className="absolute right-3 top-3.5 text-gray-400 hover:text-gray-600 p-0.5"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Course Filter Chips */}
        <div className="flex space-x-2 overflow-x-auto pb-1 scrollbar-none">
          {['All', ...COURSES].map(course => (
            <button
              key={course}
              onClick={() => setSelectedCourseFilter(course)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition shadow-sm ${
                selectedCourseFilter === course 
                  ? 'bg-amber-800 text-white shadow-amber-800/20' 
                  : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-50'
              }`}
            >
              {course}
            </button>
          ))}
        </div>

        {/* Scrollable List of Menu Items */}
        <div className="space-y-3 flex-1 pb-16">
          {filteredItems.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-xl border border-dashed border-gray-300 p-6">
              <BookOpen className="w-12 h-12 text-gray-300 mx-auto mb-2" />
              <p className="text-gray-500 font-medium">No menu items found</p>
              <p className="text-gray-400 text-sm mt-1">Try adjusting your search or filter</p>
            </div>
          ) : (
            filteredItems.map(item => (
              <div 
                key={item.id}
                className="bg-white rounded-xl p-4 shadow-sm border border-gray-200 hover:shadow-md transition flex flex-col justify-between"
              >
                <div>
                  <div className="flex justify-between items-start">
                    <span className="text-xs font-semibold tracking-wider text-amber-700 uppercase bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-200">
                      {item.course}
                    </span>
                    <span className="text-lg font-bold text-gray-900">
                      R{item.price.toFixed(2)}
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mt-1">{item.name}</h3>
                  <p className="text-gray-600 text-sm mt-0.5 line-clamp-2">{item.description}</p>
                </div>

                <div className="flex justify-end space-x-2 mt-4 pt-3 border-t border-gray-100">
                  <button
                    onClick={() => {
                      setSelectedItem(item);
                      setFormData({ name: item.name, description: item.description, course: item.course, price: item.price.toString() });
                      setFormError('');
                      setCurrentScreen('edit');
                    }}
                    className="flex items-center space-x-1 px-3 py-1.5 bg-amber-50 text-amber-800 border border-amber-300 rounded-lg text-sm font-medium hover:bg-amber-100 transition"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                    <span>[Edit]</span>
                  </button>
                  <button
                    onClick={() => {
                      setSelectedItem(item);
                      setCurrentScreen('delete');
                    }}
                    className="flex items-center space-x-1 px-3 py-1.5 bg-red-50 text-red-700 border border-red-300 rounded-lg text-sm font-medium hover:bg-red-100 transition"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>[Delete]</span>
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Floating Add Button / Bottom Bar */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-amber-50 via-amber-50/90 to-transparent flex justify-center">
        <button
          onClick={() => {
            setFormData({ name: '', description: '', course: 'Starter', price: '' });
            setFormError('');
            setCurrentScreen('add');
          }}
          className="max-w-xl w-full bg-amber-800 hover:bg-amber-900 text-white font-semibold py-3.5 px-6 rounded-xl shadow-lg flex items-center justify-center space-x-2 transition transform active:scale-95"
        >
          <Plus className="w-5 h-5 text-amber-200" />
          <span>[+ Add Menu Item]</span>
        </button>
      </div>
    </div>
  );

  const renderScreen2 = () => (
    <div className="flex flex-col h-full bg-gray-50">
      <div className="bg-amber-800 text-white p-4 shadow-md flex items-center">
        <button 
          onClick={() => setCurrentScreen('menu')}
          className="mr-3 p-1 rounded-lg hover:bg-amber-700 transition"
        >
          <ArrowLeft className="w-6 h-6" />
        </button>
        <h1 className="text-xl font-bold tracking-wide">Add Menu Item</h1>
      </div>

      <div className="p-4 flex-1 max-w-xl w-full mx-auto overflow-y-auto">
        <form onSubmit={handleSaveNewItem} className="space-y-4 bg-white p-6 rounded-2xl shadow-sm border border-gray-200 my-2">
          {formError && (
            <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-xl text-sm flex items-center space-x-2">
              <AlertTriangle className="w-4 h-4 flex-shrink-0" />
              <span>{formError}</span>
            </div>
          )}

          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">Dish Name</label>
            <input
              type="text"
              placeholder="Enter Dish Name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-amber-600 focus:outline-none text-gray-800"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">Description</label>
            <textarea
              rows="3"
              placeholder="Enter description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-amber-600 focus:outline-none text-gray-800 resize-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">Course</label>
            <div className="relative">
              <select
                value={formData.course}
                onChange={(e) => setFormData({ ...formData, course: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-amber-600 focus:outline-none text-gray-800 bg-white appearance-none cursor-pointer"
              >
                {COURSES.map(course => (
                  <option key={course} value={course}>{course}</option>
                ))}
              </select>
              <div className="absolute right-4 top-3.5 pointer-events-none text-gray-500">▼</div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">Price</label>
            <div className="relative">
              <span className="absolute left-4 top-3.5 text-gray-500 font-semibold">R</span>
              <input
                type="number"
                step="0.01"
                placeholder="Enter Price"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                className="w-full pl-9 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-amber-600 focus:outline-none text-gray-800"
              />
            </div>
          </div>

          <div className="pt-4 space-y-3">
            <button
              type="submit"
              className="w-full bg-amber-800 hover:bg-amber-900 text-white font-semibold py-3.5 px-6 rounded-xl shadow transition flex items-center justify-center space-x-2"
            >
              <Check className="w-5 h-5 text-amber-200" />
              <span>[Save menu Item]</span>
            </button>
            <button
              type="button"
              onClick={() => setCurrentScreen('menu')}
              className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-3.5 px-6 rounded-xl transition"
            >
              [Cancel]
            </button>
          </div>
        </form>
      </div>
    </div>
  );

  const renderScreen3 = () => (
    <div className="flex flex-col h-full bg-gray-50">
      <div className="bg-amber-800 text-white p-4 shadow-md flex items-center">
        <button 
          onClick={() => setCurrentScreen('menu')}
          className="mr-3 p-1 rounded-lg hover:bg-amber-700 transition"
        >
          <ArrowLeft className="w-6 h-6" />
        </button>
        <h1 className="text-xl font-bold tracking-wide">Edit Menu Item</h1>
      </div>

      <div className="p-4 flex-1 max-w-xl w-full mx-auto overflow-y-auto">
        <form onSubmit={handleUpdateItem} className="space-y-4 bg-white p-6 rounded-2xl shadow-sm border border-gray-200 my-2">
          {formError && (
            <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-xl text-sm flex items-center space-x-2">
              <AlertTriangle className="w-4 h-4 flex-shrink-0" />
              <span>{formError}</span>
            </div>
          )}

          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">Dish Name</label>
            <input
              type="text"
              placeholder="Enter Dish Name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-amber-600 focus:outline-none text-gray-800"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">Description</label>
            <textarea
              rows="3"
              placeholder="Enter Description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-amber-600 focus:outline-none text-gray-800 resize-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">Course</label>
            <div className="relative">
              <select
                value={formData.course}
                onChange={(e) => setFormData({ ...formData, course: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-amber-600 focus:outline-none text-gray-800 bg-white appearance-none cursor-pointer"
              >
                {COURSES.map(course => (
                  <option key={course} value={course}>{course}</option>
                ))}
              </select>
              <div className="absolute right-4 top-3.5 pointer-events-none text-gray-500">▼</div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">Price</label>
            <div className="relative">
              <span className="absolute left-4 top-3.5 text-gray-500 font-semibold">R</span>
              <input
                type="number"
                step="0.01"
                placeholder="Enter Price"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                className="w-full pl-9 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-amber-600 focus:outline-none text-gray-800"
              />
            </div>
          </div>

          <div className="pt-4 space-y-3">
            <button
              type="submit"
              className="w-full bg-amber-800 hover:bg-amber-900 text-white font-semibold py-3.5 px-6 rounded-xl shadow transition flex items-center justify-center space-x-2"
            >
              <Check className="w-5 h-5 text-amber-200" />
              <span>[Update Item]</span>
            </button>
            <button
              type="button"
              onClick={() => setCurrentScreen('menu')}
              className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-3.5 px-6 rounded-xl transition"
            >
              [Cancel]
            </button>
          </div>
        </form>
      </div>
    </div>
  );

  const renderScreen4 = () => (
    <div className="flex flex-col h-full bg-gray-50">
      <div className="bg-red-800 text-white p-4 shadow-md flex items-center">
        <button 
          onClick={() => setCurrentScreen('menu')}
          className="mr-3 p-1 rounded-lg hover:bg-red-700 transition"
        >
          <ArrowLeft className="w-6 h-6" />
        </button>
        <h1 className="text-xl font-bold tracking-wide">Delete Menu Item</h1>
      </div>

      <div className="p-4 flex-1 max-w-xl w-full mx-auto flex flex-col justify-center">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 space-y-6 text-center">
          <div>
            <span className="text-xs font-bold text-gray-500 uppercase tracking-wider block mb-2">Select Menu Item</span>
            <div className="p-4 bg-gray-50 border border-gray-200 rounded-xl">
              <span className="text-lg font-bold text-gray-900 block">{selectedItem ? selectedItem.name : 'Dish Name'}</span>
              {selectedItem && (
                <span className="text-sm text-amber-700 font-medium block mt-1">{selectedItem.course} • R{selectedItem.price.toFixed(2)}</span>
              )}
            </div>
          </div>

          <div className="py-2 space-y-2">
            <div className="w-12 h-12 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-3">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <p className="text-gray-900 font-bold text-lg">Are you sure you want to delete this item?</p>
            <p className="text-gray-500 text-sm">This action cannot be undone.</p>
          </div>

          <div className="space-y-3 pt-2">
            <button
              onClick={handleDeleteConfirmed}
              className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-3.5 px-6 rounded-xl shadow transition flex items-center justify-center space-x-2"
            >
              <Trash2 className="w-5 h-5" />
              <span>[Delete]</span>
            </button>
            <button
              onClick={() => setCurrentScreen('menu')}
              className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-3.5 px-6 rounded-xl transition"
            >
              [Cancel]
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  const renderScreen5 = () => (
    <div className="flex flex-col h-full bg-amber-50/50">
      <div className="bg-amber-800 text-white p-4 shadow-md flex items-center">
        <button 
          onClick={() => setCurrentScreen('menu')}
          className="mr-3 p-1 rounded-lg hover:bg-amber-700 transition"
        >
          <ArrowLeft className="w-6 h-6" />
        </button>
        <h1 className="text-xl font-bold tracking-wide">Menu Statistics</h1>
      </div>

      <div className="p-4 flex-1 max-w-xl w-full mx-auto space-y-4 overflow-y-auto my-auto">
        {/* Total Menu Items Card */}
        <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-200 flex flex-col items-center">
          <span className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Total Menu Items</span>
          <span className="text-3xl font-extrabold text-amber-800">{stats.total}</span>
        </div>

        {/* Starters Card */}
        <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-200 flex flex-col items-center">
          <span className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Starters</span>
          <span className="text-3xl font-extrabold text-amber-800">{stats.starters}</span>
        </div>

        {/* Main Courses Card */}
        <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-200 flex flex-col items-center">
          <span className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Main Courses</span>
          <span className="text-3xl font-extrabold text-amber-800">{stats.mains}</span>
        </div>

        {/* Desserts Card */}
        <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-200 flex flex-col items-center">
          <span className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Desserts</span>
          <span className="text-3xl font-extrabold text-amber-800">{stats.desserts}</span>
        </div>

        {/* Average Price Card */}
        <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-200 flex flex-col items-center">
          <span className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Average Price</span>
          <span className="text-3xl font-extrabold text-amber-800">R{stats.avgPrice}</span>
        </div>

        <div className="pt-2">
          <button
            onClick={() => setCurrentScreen('menu')}
            className="w-full bg-amber-800 hover:bg-amber-900 text-white font-semibold py-3.5 px-6 rounded-xl shadow transition flex items-center justify-center space-x-2"
          >
            <ArrowLeft className="w-5 h-5 text-amber-200" />
            <span>[Back to Menu]</span>
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center p-0 sm:p-4">
      {/* Mobile container simulation matching wireframes */}
      <div className="w-full sm:max-w-md sm:h-[840px] bg-white sm:rounded-3xl shadow-2xl overflow-hidden flex flex-col relative border border-gray-800">
        
        {/* Notification Toast */}
        {notification && (
          <div className={`absolute top-4 left-4 right-4 z-50 p-3.5 rounded-xl shadow-lg text-white font-medium text-sm flex items-center justify-between transition animate-bounce ${
            notification.type === 'error' ? 'bg-red-600' : 'bg-emerald-600'
          }`}>
            <span>{notification.message}</span>
            <button onClick={() => setNotification(null)} className="p-1 hover:bg-black/10 rounded">
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Dynamic Screen Renderer */}
        <div className="flex-1 overflow-hidden">
          {currentScreen === 'menu' && renderScreen1()}
          {currentScreen === 'add' && renderScreen2()}
          {currentScreen === 'edit' && renderScreen3()}
          {currentScreen === 'delete' && renderScreen4()}
          {currentScreen === 'stats' && renderScreen5()}
        </div>
      </div>
    </div>
  );
}