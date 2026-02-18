
export function FeatureCard({ emoji, title, desc, color }) {
  return (
    <div className="bg-white dark:bg-zinc-800 rounded-lg p-6 text-center border border-border">
      <div
        className="w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center text-3xl"
        style={{ backgroundColor: color + '20' }}
      >
        {emoji}
      </div>
      <h3 className="text-xl font-semibold mb-2" style={{ color }}>{title}</h3>
      <p className="text-muted-foreground">{desc}</p>
    </div>
  );
}

// 2. The ProductCard component
export function ProductCard({ product }) {
  return (
    <div className="bg-white dark:bg-zinc-800 rounded-lg p-4 shadow-sm border border-border hover:shadow-md transition-shadow">
      <div className="relative aspect-square mb-3 overflow-hidden rounded-md">
         <img 
           src={product.image} 
           alt={product.name} 
           className="w-full h-full object-cover" 
         />
      </div>
      <h3 className="font-bold text-lg">{product.name}</h3>
      <p className="text-sm text-muted-foreground mb-3">{product.category}</p>
      
      {/* Updated price color to match your Figma purple (#8A38F5) */}
      <p className="text-xl font-bold" style={{ color: '#8A38F5' }}>
        ${product.price.toFixed(2)}
      </p>
    </div>
  );
}