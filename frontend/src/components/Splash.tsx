import { Truck } from 'lucide-react';
import { motion } from 'framer-motion';

export function Splash() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 flex items-center justify-center overflow-hidden">
      <div className="text-center">
        <motion.div 
          className="flex items-center justify-center mb-6"
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <div className="bg-white rounded-full p-8 shadow-2xl">
            <Truck className="w-20 h-20 text-blue-600" />
          </div>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.6 }}
        >
          <h1 className="text-white text-6xl tracking-wider mb-3">
            TUCK<span className="font-bold">TRUCK</span>
          </h1>
          <p className="text-blue-200 text-lg">Your Commercial Transport Partner</p>
        </motion.div>
        
        <motion.div
          className="mt-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2, duration: 0.8 }}
        >
          <div className="flex justify-center gap-2">
            <motion.div 
              className="w-2 h-2 bg-white rounded-full"
              animate={{ opacity: [0.3, 1, 0.3] }}
              transition={{ duration: 1.5, repeat: Infinity, delay: 0 }}
            />
            <motion.div 
              className="w-2 h-2 bg-white rounded-full"
              animate={{ opacity: [0.3, 1, 0.3] }}
              transition={{ duration: 1.5, repeat: Infinity, delay: 0.2 }}
            />
            <motion.div 
              className="w-2 h-2 bg-white rounded-full"
              animate={{ opacity: [0.3, 1, 0.3] }}
              transition={{ duration: 1.5, repeat: Infinity, delay: 0.4 }}
            />
          </div>
        </motion.div>
      </div>
    </div>
  );
}