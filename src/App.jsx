import { useState } from 'react'
import './App.css'

const initialFriends = []

function Button({ children, onClick, variant = 'primary', className = '' }) {
  return (
    <button className={`btn btn-${variant} ${className}`} onClick={onClick}>
      {children}
    </button>
  )
}

function App() {
  const [friends, setFriends] = useState([])
  const [showAddFriend, setShowAddFriend] = useState(false)
  const [selectedFriend, setSelectedFriend] = useState(null)
  const [showHint, setShowHint] = useState(true)

  function handleShowAddFriend() {
    setShowAddFriend((show) => !show)
  }

  function handleAddFriend(friend) {
    setFriends((friends) => [...friends, friend])
    setShowAddFriend(false)
  }

  function handleSelection(friend) {
    setSelectedFriend((cur) => (cur?.id === friend.id ? null : friend))
    setShowAddFriend(false)
  }

  function handleSplitBill(value) {
    setFriends((friends) =>
      friends.map((friend) =>
        friend.id === selectedFriend.id
          ? { ...friend, balance: friend.balance + value }
          : friend
      )
    )

    setSelectedFriend(null)
  }

  return (
    <div className="app">
      <header className="header">
        <div className="header-content">
          <h1 className="logo">
            <span className="logo-icon">💰</span>
            SplitWise
          </h1>
          <p className="subtitle">Split bills effortlessly with friends</p>
        </div>
        {showHint && (
          <div className="hint-banner">
            <div className="hint-content">
              <span className="hint-icon">💡</span>
              <span>
                Add friends, select one, and split bills to track who owes what
              </span>
              <button
                className="hint-close"
                onClick={() => setShowHint(false)}
                aria-label="Close hint"
              >
                ×
              </button>
            </div>
          </div>
        )}
      </header>

      <main className="main-content">
        <div className="sidebar">
          <div className="section">
            <div className="section-header">
              <h2>Friends</h2>
              <span className="badge">{friends.length}</span>
            </div>
            <FriendsList
              friends={friends}
              selectedFriend={selectedFriend}
              onSelection={handleSelection}
            />
          </div>

          {showAddFriend && (
            <div className="section">
              <FormAddFriend onAddFriend={handleAddFriend} />
            </div>
          )}

          <Button
            onClick={handleShowAddFriend}
            variant={showAddFriend ? 'secondary' : 'primary'}
          >
            {showAddFriend ? 'Cancel' : 'Add Friend'}
          </Button>
        </div>

        <div className="main-panel">
          {selectedFriend ? (
            <FormSplitBill
              selectedFriend={selectedFriend}
              onSplitBill={handleSplitBill}
            />
          ) : (
            <div className="empty-state">
              <div className="empty-state-icon">🤝</div>
              <h3>Select a friend to split a bill</h3>
              <p>
                Choose someone from your friends list to start splitting
                expenses
              </p>
            </div>
          )}
        </div>
      </main>

      <footer className="footer">
        <div className="footer-content">
          <div className="footer-section">
            <h4>How it works</h4>
            <ul>
              <li>Add friends to your list</li>
              <li>Select a friend and enter bill details</li>
              <li>Track balances automatically</li>
            </ul>
          </div>
          <div className="footer-section">
            <h4>Color coding</h4>
            <ul>
              <li>
                <span className="color-indicator green"></span>They owe you
                money
              </li>
              <li>
                <span className="color-indicator red"></span>You owe them money
              </li>
              <li>
                <span className="color-indicator gray"></span>All settled up
              </li>
            </ul>
          </div>
        </div>
      </footer>
    </div>
  )
}

function handleEnterSubmit(e, submitFn) {
  if (e.key === 'Enter') {
    submitFn()
  }
}

function FriendsList({ friends, onSelection, selectedFriend }) {
  if (friends.length === 0) {
    return (
      <div className="empty-friends-state">
        <div className="welcome-icon">👋</div>
        <h3>Welcome to SplitWise!</h3>
        <p>Add your first friend to start splitting bills</p>
      </div>
    )
  }

  return (
    <div className="friends-list">
      {friends.map((friend) => (
        <Friend
          friend={friend}
          key={friend.id}
          selectedFriend={selectedFriend}
          onSelection={onSelection}
        />
      ))}
    </div>
  )
}

function Friend({ friend, onSelection, selectedFriend }) {
  const isSelected = selectedFriend?.id === friend.id

  return (
    <div className={`friend-card ${isSelected ? 'selected' : ''}`}>
      <div className="friend-avatar">
        <img src={friend.image} alt={friend.name} />
      </div>

      <div className="friend-info">
        <h3 className="friend-name">{friend.name}</h3>
        {friend.balance < 0 && (
          <p className="balance negative">
            You owe €{Math.abs(friend.balance)}
          </p>
        )}
        {friend.balance > 0 && (
          <p className="balance positive">
            Owes you €{Math.abs(friend.balance)}
          </p>
        )}
        {friend.balance === 0 && (
          <p className="balance neutral">All settled up</p>
        )}
      </div>

      <Button
        onClick={() => onSelection(friend)}
        variant={isSelected ? 'secondary' : 'ghost'}
        className="friend-action"
      >
        {isSelected ? 'Close' : 'Select'}
      </Button>
    </div>
  )
}

function FormAddFriend({ onAddFriend }) {
  const [name, setName] = useState('')
  const [image, setImage] = useState('https://i.pravatar.cc/48')

  function handleSubmit() {
    if (!name || !image) return

    const id = crypto.randomUUID()
    const newFriend = {
      id,
      name,
      image: `${image}?=${id}`,
      balance: 0,
    }

    onAddFriend(newFriend)

    setName('')
    setImage('https://i.pravatar.cc/48')
  }

  return (
    <div className="form add-friend-form">
      <h3 className="form-title">Add New Friend</h3>

      <div className="form-group">
        <label htmlFor="friend-name">Friend Name</label>
        <input
          id="friend-name"
          type="text"
          placeholder="Enter friend's name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="form-input"
          onKeyDown={(e) => handleEnterSubmit(e, handleSubmit)}
        />
      </div>

      <div className="form-group">
        <label htmlFor="friend-image">Avatar URL</label>
        <input
          id="friend-image"
          type="url"
          placeholder="https://i.pravatar.cc/48"
          value={image}
          onChange={(e) => setImage(e.target.value)}
          className="form-input"
          onKeyDown={(e) => handleEnterSubmit(e, handleSubmit)}
        />
      </div>

      <Button onClick={handleSubmit}>Add Friend</Button>
    </div>
  )
}

function FormSplitBill({ selectedFriend, onSplitBill }) {
  const [bill, setBill] = useState('')
  const [paidByUser, setPaidByUser] = useState('')
  const paidByFriend = bill ? bill - paidByUser : ''
  const [whoIsPaying, setWhoIsPaying] = useState('user')

  function handleSubmit() {
    if (!bill || !paidByUser) return
    onSplitBill(whoIsPaying === 'user' ? paidByFriend : -paidByUser)
  }

  return (
    <div className="split-bill-container">
      <div className="split-header">
        <h2>Split Bill with {selectedFriend.name}</h2>
        <div className="friend-preview">
          <img src={selectedFriend.image} alt={selectedFriend.name} />
          <span>{selectedFriend.name}</span>
        </div>
      </div>

      <div className="form split-bill-form">
        <div className="form-group">
          <label htmlFor="bill-value">💰 Total Bill Amount</label>
          <input
            id="bill-value"
            type="number"
            step="0.01"
            placeholder="0.00"
            value={bill}
            onChange={(e) => setBill(Number(e.target.value))}
            className="form-input"
            onKeyDown={(e) => handleEnterSubmit(e, handleSubmit)}
          />
        </div>

        <div className="form-group">
          <label htmlFor="your-expense">🧑‍🦰 Your Expense</label>
          <input
            id="your-expense"
            type="number"
            step="0.01"
            placeholder="0.00"
            value={paidByUser}
            onChange={(e) =>
              setPaidByUser(
                Number(e.target.value) > bill
                  ? paidByUser
                  : Number(e.target.value)
              )
            }
            className="form-input"
            onKeyDown={(e) => handleEnterSubmit(e, handleSubmit)}
          />
        </div>

        <div className="form-group">
          <label htmlFor="friend-expense">
            🧑‍🤝‍🧑 {selectedFriend.name}'s Expense
          </label>
          <input
            id="friend-expense"
            type="number"
            disabled
            value={paidByFriend || 0}
            className="form-input disabled"
          />
        </div>

        <div className="form-group">
          <label htmlFor="who-paying">💵 Who is paying the bill?</label>
          <select
            id="who-paying"
            value={whoIsPaying}
            onChange={(e) => setWhoIsPaying(e.target.value)}
            className="form-select"
          >
            <option value="user">You</option>
            <option value="friend">{selectedFriend.name}</option>
          </select>
        </div>

        <Button onClick={handleSubmit} className="split-btn">
          Split Bill
        </Button>
      </div>
    </div>
  )
}

export default App
