// components/Card3D.js
// Card 3D reutilizável com efeito de profundidade

export default function Card3D({ 
  children, 
  gradient = 'from-purple-900/30 to-pink-900/30',
  borderColor = 'border-purple-500/30',
  hoverBorderColor = 'border-purple-500',
  glowColor = 'rgba(168, 85, 247, 0.3)',
  className = ''
}) {
  return (
    <div className={`card-3d group relative ${className}`}>
      {/* Card principal */}
      <div 
        className={`relative bg-gradient-to-br ${gradient} backdrop-blur-sm rounded-2xl p-6 border ${borderColor} hover:${hoverBorderColor} transition-all duration-300`}
        style={{
          boxShadow: `0 10px 30px ${glowColor}`
        }}
      >
        {/* Efeito de brilho no hover */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 rounded-2xl"></div>
        
        {/* Conteúdo */}
        <div className="relative z-10">
          {children}
        </div>
      </div>

      {/* Sombra para profundidade */}
      <div 
        className={`absolute inset-0 bg-gradient-to-br ${gradient} rounded-2xl blur-xl opacity-0 group-hover:opacity-50 transition-opacity -z-10`}
      ></div>
    </div>
  );
}
