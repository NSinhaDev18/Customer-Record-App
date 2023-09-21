let customers = [];
const capacity = 25;
let seatsLeft = 25;

const formRef = React.createRef();
const countRef = React.createRef();
let nameRef = React.createRef();
let phoneRef = React.createRef();

const addToCustomerHistory = (name, phone, count) => {
  const details = {
    name,
    phone,
    count,
    checkin: new Date(),
    checkout: null,
  };

  customers.unshift(details);
};

const checkIfEntryExists = (phone) => {
  return customers.find((c) => c.phone === phone && !c.checkout);
};

const handleCheckout = (phone, count) => {
  customers.forEach((c) => {
    if (c.phone === phone) {
      c.checkout = new Date();
    }
  });

  seatsLeft += count;

  rootElement.render(<App />);
};

const handleRemove = (index) => {
  let removedEntry = customers.splice(index, 1);
  if (!removedEntry[0].checkout) {
    seatsLeft += removedEntry[0].count;
  }
  rootElement.render(<App />);
};

const handleSubmit = (e) => {
  e.preventDefault();
  const name = nameRef.current.value;
  const phone = phoneRef.current.value;
  const count = parseInt(countRef.current.value);

  if (checkIfEntryExists(phone)) {
    alert("User already exists.");
    return;
  }

  if (count > seatsLeft) {
    alert("Guest count exceeds capacity.");
    return;
  }
  addToCustomerHistory(name, phone, count);
  seatsLeft -= count;
  formRef.current.reset();

  rootElement.render(<App />);
};

const App = () => (
  <div className="App" style={{ textAlign: "center" }}>
    <div>
      <h2>Total Capacity: {capacity}</h2>
      <h2>Seats Left: {seatsLeft}</h2>
    </div>
    <form ref={formRef} onSubmit={handleSubmit}>
      <input
        ref={countRef}
        type="number"
        placeholder="Guests Count"
        min="1"
        required
      />
      <br />
      <input ref={nameRef} placeholder="Primary Guest Name" required />
      <br />
      <input ref={phoneRef} type="tel" placeholder="Phone Number" required />
      <br />
      <br />
      <button>Add Entry</button>
    </form>

    <br />
    <br />
    <br />

    <table border="1px" style={{ margin: "auto" }}>
      <thead>
        <tr>
          <th>Count</th>
          <th>Name</th>
          <th>Phone</th>
          <th>Check In</th>
          <th>Check Out</th>
          <th>Status</th>
          <th>Remove Entry</th>
        </tr>
      </thead>
      <tbody>
        {customers.map((c, i) => (
          <tr key={i}>
            <td>{c.count}</td>
            <td>{c.name}</td>
            <td>{c.phone}</td>
            <td>{c.checkin.toLocaleTimeString()}</td>
            <td>{c.checkout ? c.checkout.toLocaleTimeString() : <>-</>}</td>
            {c.checkout ? (
              <td className="served">Served</td>
            ) : (
              <td
                className="dining"
                onClick={() => {
                  handleCheckout(c.phone, c.count);
                }}
              >
                Click to Checkout
              </td>
            )}
            <td
              onClick={() => {
                handleRemove(i);
              }}
            >
              Delete
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

const rootElement = ReactDOM.createRoot(document.getElementById("root"));
rootElement.render(<App />);
