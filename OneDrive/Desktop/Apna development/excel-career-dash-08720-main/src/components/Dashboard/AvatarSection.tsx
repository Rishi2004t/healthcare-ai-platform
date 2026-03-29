import { motion } from "framer-motion";
import { MessageCircle, Sparkles } from "lucide-react";
import { RiyaAssistant } from "../Resume/RiyaAssistant";
import { Phone3D } from "../Phone3D";

export function AvatarSection() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8 }}
      className="relative w-full overflow-hidden"
    >
      {/* Clean Hero Showcase Container */}
      <div className="relative min-h-[500px] lg:min-h-[650px] flex items-center justify-center p-6 bg-background border-y border-border/10">
        
        {/* Main Showcase Content */}
        <div className="relative z-10 w-full max-w-5xl mx-auto flex flex-col items-center">
          
          {/* Centered 3D Phone Model */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="w-full max-w-[420px] h-[550px] lg:h-[620px] pointer-events-auto relative"
          >
            <Phone3D 
              className="w-full h-full" 
              scale={2.2} 
              cameraPosition={[0, 0, 6.5]} 
            >
              <RiyaAssistant inline={true} />
            </Phone3D>
          </motion.div>

          {/* Minimal Interactive Hint */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.5 }}
            className="mt-6 flex items-center gap-2 text-[10px] font-medium text-muted-foreground/30 uppercase tracking-[0.3em]"
          >
            <span>Interactive 3D Experience</span>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}
