import type { WireframeComponent } from '../types';

export function generateComponentCode(component: WireframeComponent): string {
    const { type, properties } = component;

    switch (type) {
        case 'button':
            return `<button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">
  ${properties.text || 'Button'}
</button>`;

        case 'input':
            return `<div className="flex flex-col gap-1">
  <label className="text-sm font-medium text-gray-700">${properties.label || 'Label'}</label>
  <input 
    type="text" 
    placeholder="${properties.placeholder || 'Placeholder'}" 
    className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
  />
</div>`;

        case 'card':
            return `<div className="bg-white border border-gray-200 rounded-lg shadow-sm p-4">
  <h3 className="text-lg font-semibold mb-2">${properties.title || 'Card Title'}</h3>
  <div className="text-gray-600">
    {/* Content goes here */}
  </div>
</div>`;

        case 'text':
            return `<p className="text-base text-gray-800" style={{ fontSize: '${properties.fontSize || 16}px' }}>
  ${properties.text || 'Text block'}
</p>`;

        case 'image':
            return `<div className="relative w-full overflow-hidden bg-gray-100 rounded-md aspect-video flex items-center justify-center">
  <img 
    src="/placeholder.jpg" 
    alt="${properties.text || 'Image'}" 
    className="object-cover w-full h-full"
  />
</div>`;

        case 'avatar':
            return `<div className="w-12 h-12 rounded-full overflow-hidden bg-gray-300 border border-gray-200">
  <img 
    src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix" 
    alt="Avatar" 
    className="w-full h-full object-cover"
  />
</div>`;

        case 'toggle':
            return `<button 
  className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"
  aria-pressed="${properties.value}"
>
</button>`;

        case 'checkbox':
            return `<div className="flex items-center space-x-2">
  <input type="checkbox" id="checkbox" className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500" />
  <label htmlFor="checkbox" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">${properties.label || 'Checkbox'}</label>
</div>`;

        case 'sticky-note':
            return `{/* Sticky Note: ${properties.text} */}`;

        default:
            return `<div>${type}</div>`;
    }
}
