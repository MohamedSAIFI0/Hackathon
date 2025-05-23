import React, { useState, useEffect, useRef, useCallback } from 'react';
import { AlertTriangle, Shield } from 'lucide-react';

const AntiCheatDetector = ({ 
  userId, 
  examId, 
  maxViolations = 3,
  onViolation,
  onExamBlocked,
  isActive = true,
  showWarnings = true
}) => {
  const [violations, setViolations] = useState(0);
  const [isBlocked, setIsBlocked] = useState(false);
  const [showWarning, setShowWarning] = useState(false);
  const [warningMessage, setWarningMessage] = useState('');
  
  const devToolsCheckInterval = useRef(null);
  const lastViolationTime = useRef(0);
  const originalConsoleLog = useRef(console.log);
  const isInitialized = useRef(false);

  // Types de violations
  const VIOLATION_TYPES = {
    TAB_SWITCH: 'Changement d\'onglet détecté',
    WINDOW_BLUR: 'Perte de focus de la fenêtre',
    ALT_TAB: 'Utilisation d\'Alt+Tab détectée',
    DEV_TOOLS: 'Console développeur ouverte',
    COPY_PASTE: 'Tentative de copier/coller',
    CONTEXT_MENU: 'Menu contextuel utilisé',
    KEYBOARD_SHORTCUT: 'Raccourci clavier bloqué'
  };

  // Fonction de logging des violations
  const logViolation = useCallback(async (violationType, details = {}) => {
    if (!isActive) return;

    const violationData = {
      userId,
      examId,
      violationType,
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
      url: window.location.href,
      details
    };

    try {
      await fetch('/api/log-violation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(violationData)
      });
    } catch (error) {
      console.error('Erreur logging:', error);
    }

    return violationData;
  }, [userId, examId, isActive]);

  // Gestionnaire principal des violations
  const handleViolation = useCallback(async (violationType, details = {}) => {
    if (!isActive || !isInitialized.current) return;

    const now = Date.now();
    // Éviter les doublons rapides
    if (now - lastViolationTime.current < 1000) return;
    lastViolationTime.current = now;

    const newViolationCount = violations + 1;
    setViolations(newViolationCount);
    
    // Logger la violation
    const violationData = await logViolation(violationType, { 
      ...details, 
      violationCount: newViolationCount 
    });

    // Callback personnalisé
    if (onViolation) {
      onViolation(violationData);
    }

    // Affichage de l'avertissement
    if (showWarnings) {
      setWarningMessage(VIOLATION_TYPES[violationType] || violationType);
      setShowWarning(true);
      setTimeout(() => setShowWarning(false), 3000);
    }
    
    // Vérifier si l'examen doit être bloqué
    if (newViolationCount >= maxViolations) {
      setIsBlocked(true);
      if (onExamBlocked) {
        onExamBlocked(newViolationCount, violationData);
      }
    }
  }, [violations, maxViolations, isActive, logViolation, onViolation, onExamBlocked, showWarnings]);

  // 1. Détection changement d'onglet / perte de focus
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        handleViolation('TAB_SWITCH');
      }
    };

    const handleWindowBlur = () => {
      handleViolation('WINDOW_BLUR');
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('blur', handleWindowBlur);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('blur', handleWindowBlur);
    };
  }, [handleViolation]);

  // 2. Détection des raccourcis clavier
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!isActive || !isInitialized.current) return;

      // Alt+Tab (Windows) ou Cmd+Tab (Mac)
      if ((e.altKey && e.key === 'Tab') || (e.metaKey && e.key === 'Tab')) {
        e.preventDefault();
        handleViolation('ALT_TAB');
        return;
      }

      // DevTools shortcuts: F12, Ctrl+Shift+I, Ctrl+Shift+J, Ctrl+U
      if (e.key === 'F12' || 
          (e.ctrlKey && e.shiftKey && ['I', 'J', 'C'].includes(e.key)) ||
          (e.ctrlKey && e.key === 'U')) {
        e.preventDefault();
        handleViolation('DEV_TOOLS');
        return;
      }

      // Copy/Paste: Ctrl+C, Ctrl+V, Ctrl+A, Ctrl+X
      if (e.ctrlKey && ['c', 'v', 'a', 'x'].includes(e.key.toLowerCase())) {
        e.preventDefault();
        handleViolation('COPY_PASTE', { key: e.key });
        return;
      }

      // Autres raccourcis suspects
      if (e.ctrlKey && e.shiftKey) {
        e.preventDefault();
        handleViolation('KEYBOARD_SHORTCUT', { 
          ctrl: e.ctrlKey, 
          shift: e.shiftKey, 
          key: e.key 
        });
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [handleViolation, isActive]);

  // 3. Désactiver le menu contextuel
  useEffect(() => {
    const handleContextMenu = (e) => {
      if (!isActive || !isInitialized.current) return;
      e.preventDefault();
      handleViolation('CONTEXT_MENU');
    };

    document.addEventListener('contextmenu', handleContextMenu);
    return () => document.removeEventListener('contextmenu', handleContextMenu);
  }, [handleViolation, isActive]);

  // 4. Détection DevTools avancée
  useEffect(() => {
    if (!isActive) return;

    let devtools = { open: false };
    const threshold = 160;

    const checkDevTools = () => {
      if (!isInitialized.current) return;

      // Méthode 1: Taille de fenêtre
      if (window.outerHeight - window.innerHeight > threshold || 
          window.outerWidth - window.innerWidth > threshold) {
        if (!devtools.open) {
          devtools.open = true;
          handleViolation('DEV_TOOLS', { method: 'window_size' });
        }
      } else {
        devtools.open = false;
      }

      // Méthode 2: Performance timing
      const start = performance.now();
      console.clear();
      const end = performance.now();
      if (end - start > 100) {
        handleViolation('DEV_TOOLS', { method: 'console_timing' });
      }
    };

    // Vérification périodique
    devToolsCheckInterval.current = setInterval(checkDevTools, 1000);

    // Override console methods
    const originalMethods = {};
    ['log', 'warn', 'error', 'info', 'debug'].forEach(method => {
      originalMethods[method] = console[method];
      console[method] = function(...args) {
        if (isInitialized.current) {
          handleViolation('DEV_TOOLS', { method: 'console_override', console_method: method });
        }
        return originalMethods[method].apply(console, args);
      };
    });

    return () => {
      if (devToolsCheckInterval.current) {
        clearInterval(devToolsCheckInterval.current);
      }
      // Restaurer les méthodes console
      Object.keys(originalMethods).forEach(method => {
        console[method] = originalMethods[method];
      });
    };
  }, [handleViolation, isActive]);

  // Initialisation avec délai
  useEffect(() => {
    if (isActive) {
      const timer = setTimeout(() => {
        isInitialized.current = true;
      }, 2000); // Délai pour éviter les faux positifs au chargement

      return () => clearTimeout(timer);
    } else {
      isInitialized.current = false;
    }
  }, [isActive]);

  // Méthodes publiques
  const resetViolations = useCallback(() => {
    setViolations(0);
    setIsBlocked(false);
  }, []);

  const forceBlock = useCallback(() => {
    setIsBlocked(true);
    if (onExamBlocked) {
      onExamBlocked(violations, { forced: true });
    }
  }, [violations, onExamBlocked]);

  // Interface utilisateur minimale
  const WarningToast = () => {
    if (!showWarning || !showWarnings) return null;

    return (
      <div className="fixed top-4 right-4 bg-red-500 text-white p-4 rounded-lg shadow-lg z-50 max-w-sm">
        <div className="flex items-center">
          <AlertTriangle className="w-5 h-5 mr-2 flex-shrink-0" />
          <div>
            <div className="font-semibold text-sm">{warningMessage}</div>
            <div className="text-xs opacity-90">
              Violations: {violations}/{maxViolations}
            </div>
          </div>
        </div>
      </div>
    );
  };

  const BlockedScreen = () => {
    if (!isBlocked) return null;

    return (
      <div className="fixed inset-0 bg-red-600 bg-opacity-95 flex items-center justify-center z-50">
        <div className="bg-white p-8 rounded-lg shadow-xl max-w-md mx-4 text-center">
          <Shield className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-red-600 mb-4">
            Examen Suspendu
          </h2>
          <p className="text-gray-700 mb-2">
            Votre examen a été interrompu suite à {violations} violation(s) détectée(s).
          </p>
          <p className="text-sm text-gray-500">
            Contactez votre superviseur d'examen.
          </p>
        </div>
      </div>
    );
  };

  // Exposer les données via une ref ou retour
  React.useImperativeHandle(React.forwardRef(() => null), () => ({
    violations,
    isBlocked,
    resetViolations,
    forceBlock,
    isActive: isActive && isInitialized.current
  }));

  return (
    <>
      <WarningToast />
      <BlockedScreen />
    </>
  );
};

// Hook personnalisé pour utilisation simplifiée
export const useAntiCheat = (config) => {
  const [detectorState, setDetectorState] = useState({
    violations: 0,
    isBlocked: false,
    isActive: false
  });

  const detectorRef = useRef();

  const handleViolation = useCallback((violationData) => {
    setDetectorState(prev => ({
      ...prev,
      violations: violationData.details?.violationCount || prev.violations + 1
    }));
    
    if (config.onViolation) {
      config.onViolation(violationData);
    }
  }, [config]);

  const handleBlocked = useCallback((violationCount, violationData) => {
    setDetectorState(prev => ({
      ...prev,
      isBlocked: true
    }));
    
    if (config.onExamBlocked) {
      config.onExamBlocked(violationCount, violationData);
    }
  }, [config]);

  const detector = (
    <AntiCheatDetector
      ref={detectorRef}
      {...config}
      onViolation={handleViolation}
      onExamBlocked={handleBlocked}
    />
  );

  return {
    detector,
    violations: detectorState.violations,
    isBlocked: detectorState.isBlocked,
    reset: () => detectorRef.current?.resetViolations(),
    forceBlock: () => detectorRef.current?.forceBlock()
  };
};

// Exemple d'intégration
const ExamIntegrationExample = () => {
  const { detector, violations, isBlocked } = useAntiCheat({
    userId: "user123",
    examId: "exam456",
    maxViolations: 3,
    isActive: true,
    showWarnings: true,
    onViolation: (data) => {
      console.log('Violation détectée:', data);
      // Vos actions personnalisées
    },
    onExamBlocked: (count, data) => {
      console.log('Examen bloqué:', count, data);
      // Redirection, sauvegarde, etc.
    }
  });

  return (
    <div className="p-6">
      {/* Votre contenu d'examen existant */}
      <h1>Mon Examen</h1>
      <p>Status: {violations} violations - {isBlocked ? 'Bloqué' : 'Actif'}</p>
      
      {/* Le détecteur s'intègre simplement */}
      {detector}
    </div>
  );
};

export default AntiCheatDetector;