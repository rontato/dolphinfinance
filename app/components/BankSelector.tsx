import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';

interface BankSelectorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

const banks = [
  { name: 'Chase', logo: '/assets/bank-logos/Chase_Logo.svg' },
  { name: 'Bank of America', logo: '/assets/bank-logos/Bofo_Logo.svg' },
  { name: 'Wells Fargo', logo: '/assets/bank-logos/Wells_Fargo_Logo.svg' },
  { name: 'Capital One', logo: '/assets/bank-logos/capital_one_logo.svg' },
  { name: 'Citibank (Citi)', logo: '/assets/bank-logos/Citi_Logo.svg' },
  { name: 'U.S. Bank', logo: '/assets/bank-logos/US_Bank_Logo.svg' },
  { name: 'Ally Bank', logo: '/assets/bank-logos/Ally_Logo.svg' },
  { name: 'SoFi', logo: '/assets/bank-logos/SoFi_logo.svg' },
  { name: 'Chime', logo: '/assets/bank-logos/Chime_logo.svg' },
  { name: 'Discover Bank', logo: '/assets/bank-logos/discover_logo.svg' },
];

export default function BankSelector({ value, onChange, placeholder = 'Select your bank' }: BankSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const wrapperRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const filteredBanks = banks.filter(bank =>
    bank.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  const handleBankSelect = (bankName: string) => {
    onChange(bankName);
    setSearchTerm('');
    setIsOpen(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      const customBank = searchTerm.trim();
      if (customBank) {
        onChange(customBank);
        setSearchTerm('');
        setIsOpen(false);
      }
    }
  };

  return (
    <div className="relative w-full" ref={wrapperRef}>
      <div
        className="w-full p-3 border rounded-lg cursor-pointer hover:border-blue-500"
        onClick={() => setIsOpen(true)}
      >
        {value || placeholder}
      </div>

      {isOpen && (
        <div className="absolute w-full mt-1 bg-white border rounded-lg shadow-lg max-h-96 overflow-y-auto z-10">
          <div className="p-3 border-b">
            <input
              ref={inputRef}
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Search banks..."
              className="w-full p-2 border rounded"
            />
          </div>

          {searchTerm.trim() &&
            !banks.some(bank => bank.name.toLowerCase() === searchTerm.trim().toLowerCase()) && (
              <div
                className="p-4 border-b bg-blue-50 cursor-pointer hover:bg-blue-100 text-blue-700 font-semibold"
                onClick={() => handleBankSelect(searchTerm.trim())}
              >
                Add "{searchTerm.trim()}" as your bank
              </div>
            )}

          <div className="grid grid-cols-2 gap-4 p-4">
            {filteredBanks.map((bank) => (
              <div
                key={bank.name}
                className="flex flex-col items-center p-4 border rounded-lg cursor-pointer hover:bg-gray-50"
                onClick={() => handleBankSelect(bank.name)}
                title={bank.name}
              >
                <div className="relative w-16 h-16">
                  <Image
                    src={bank.logo}
                    alt={bank.name}
                    fill
                    className="object-contain"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
} 