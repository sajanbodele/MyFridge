import React, { useState } from 'react';
import { Plus, Users, Home, ChevronDown, Settings, Trash2, UserPlus, Check, X } from 'lucide-react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function FridgeSwitcher({ 
  fridges, 
  currentFridge, 
  onSwitch, 
  onCreate, 
  onInvite,
  onDelete,
  currentUser 
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [showCreate, setShowCreate] = useState(false);
  const [showInvite, setShowInvite] = useState(null);
  const [newName, setNewName] = useState('');
  const [inviteEmail, setInviteEmail] = useState('');

  const handleCreate = () => {
    if (newName.trim()) {
      onCreate(newName.trim());
      setNewName('');
      setShowCreate(false);
    }