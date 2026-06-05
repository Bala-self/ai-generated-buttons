import FlipCard from '../components/FlipCard.jsx';
import { useCart } from '../context/CartContext.jsx';

export default function Cart() {
  const { items, remove } = useCart();

  return (
    <>
      <header className="mb-8">
        <h1 className="text-3xl font-extrabold">Your cart</h1>
        <p className="text-slate-400 text-sm mt-1">
          Click <span className="text-fuchsia-300 font-semibold">View Code</span> on any card to flip it and grab the syntax.
        </p>
      </header>

      {items.length === 0 ? (
        <div className="glass p-12 text-center">
          <p className="text-xl font-semibold mb-2">Your cart is empty</p>
          <p className="text-slate-400">Browse the gallery and add some buttons!</p>
        </div>
      ) : (
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((b) => (
            <FlipCard key={b._id} button={b} onRemove={remove} />
          ))}
        </section>
      )}
    </>
  );
}
