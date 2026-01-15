// Catalog Editor - Edit menu items and prices for all client types

import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../../store';
import { updateClient } from '../../store/slices/clientSlice';
import { Client, CatalogCategory, CatalogItem } from '../../types';
import { Button, TextField, MenuItem, Alert, IconButton } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import CategoryIcon from '@mui/icons-material/Category';

interface Props {
  client: Client;
}

const CatalogEditor = ({ client }: Props) => {
  const dispatch = useDispatch<AppDispatch>();
  const [catalog, setCatalog] = useState<CatalogCategory[]>(
    client.configuration.catalog || []
  );
  const [hasChanges, setHasChanges] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [editingCategoryIndex, setEditingCategoryIndex] = useState<number | null>(null);
  const [editingCategoryName, setEditingCategoryName] = useState('');

  // Check if this is a clothing store to show size/color/gender fields
  const isClothingStore = client.segment === 'clothing';

  // Sync local state when client prop updates (after save)
  useEffect(() => {
    setCatalog(client.configuration.catalog || []);
  }, [client.configuration.catalog]);

  const handleSave = async () => {
    setError(null);
    setSuccess(null);

    // ✅ Frontend validation before API call
    for (const category of catalog) {
      if (!category.category.trim()) {
        setError('O nome da categoria não pode estar vazio');
        return;
      }
      for (const item of category.items) {
        if (!item.name.trim()) {
          setError(`Preencha o nome do item na categoria "${category.category}"`);
          return;
        }
        if (item.price < 0) {
          setError(`O preço não pode ser negativo para "${item.name}"`);
          return;
        }
      }
    }

    const updatedConfiguration = {
      ...client.configuration,
      catalog
    };

    const result = await dispatch(updateClient({
      clientId: client.id,
      configuration: updatedConfiguration
    }));

    // ✅ Check if action succeeded
    if (updateClient.fulfilled.match(result)) {
      setSuccess('Catálogo salvo com sucesso!');
      setHasChanges(false);
      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(null), 3000);
    } else {
      // ✅ Show error to user
      setError(result.error?.message || 'Falha ao salvar catálogo');
      // ✅ hasChanges stays true so user can retry
    }
  };

  const addItem = (categoryIndex: number) => {
    const newCatalog = catalog.map((category, idx) => {
      if (idx === categoryIndex) {
        return {
          ...category,
          items: [...category.items, { name: '', price: 0 }]
        };
      }
      return category;
    });
    setCatalog(newCatalog);
    setHasChanges(true);
  };

  const updateItem = (
    categoryIndex: number,
    itemIndex: number,
    field: keyof CatalogItem,
    value: string | number
  ) => {
    const newCatalog = catalog.map((category, catIdx) => {
      if (catIdx === categoryIndex) {
        return {
          ...category,
          items: category.items.map((item, itmIdx) => {
            if (itmIdx === itemIndex) {
              return { ...item, [field]: value };
            }
            return item;
          })
        };
      }
      return category;
    });
    setCatalog(newCatalog);
    setHasChanges(true);
  };

  const removeItem = (categoryIndex: number, itemIndex: number) => {
    const newCatalog = catalog.map((category, idx) => {
      if (idx === categoryIndex) {
        return {
          ...category,
          items: category.items.filter((_, itemIdx) => itemIdx !== itemIndex)
        };
      }
      return category;
    });
    setCatalog(newCatalog);
    setHasChanges(true);
  };

  // Add new category
  const addCategory = () => {
    if (!newCategoryName.trim()) {
      return;
    }
    const newCategory: CatalogCategory = {
      category: newCategoryName.trim(),
      items: []
    };
    setCatalog([...catalog, newCategory]);
    setNewCategoryName('');
    setHasChanges(true);
  };

  // Update category name
  const updateCategoryName = (categoryIndex: number) => {
    if (!editingCategoryName.trim()) {
      setEditingCategoryIndex(null);
      return;
    }
    const newCatalog = catalog.map((category, idx) => {
      if (idx === categoryIndex) {
        return {
          ...category,
          category: editingCategoryName.trim()
        };
      }
      return category;
    });
    setCatalog(newCatalog);
    setEditingCategoryIndex(null);
    setEditingCategoryName('');
    setHasChanges(true);
  };

  // Start editing category name
  const startEditingCategory = (categoryIndex: number) => {
    setEditingCategoryIndex(categoryIndex);
    setEditingCategoryName(catalog[categoryIndex].category);
  };

  // Cancel editing category name
  const cancelEditingCategory = () => {
    setEditingCategoryIndex(null);
    setEditingCategoryName('');
  };

  // Remove category
  const removeCategory = (categoryIndex: number) => {
    const newCatalog = catalog.filter((_, idx) => idx !== categoryIndex);
    setCatalog(newCatalog);
    setHasChanges(true);
  };

  return (
    <div className="bg-white rounded-sm shadow p-4 sm:p-6">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 sm:gap-0 mb-4 sm:mb-6">
        <h2 className="text-base sm:text-lg font-semibold text-gray-900 animate-fade-down duration-very-fast">
          {isClothingStore ? 'Catálogo de Produtos' : 'Cardápio'}
        </h2>
        {hasChanges && (
          <Button
            onClick={handleSave}
            variant="contained"
            className="animate-fade-left duration-fast"
            fullWidth
            sx={{ maxWidth: { sm: '200px' } }}
          >
            Salvar Alterações
          </Button>
        )}
      </div>

      {error && (
        <Alert severity="error" onClose={() => setError(null)} className="mb-4 animate-fade-down duration-fast">
          {error}
        </Alert>
      )}
      {success && (
        <Alert severity="success" onClose={() => setSuccess(null)} className="mb-4 animate-fade-down duration-fast">
          {success}
        </Alert>
      )}

      <div className="space-y-6 sm:space-y-8">
        {catalog.map((category, categoryIndex) => (
          <div key={categoryIndex} className={`border border-gray-200 rounded-sm p-3 sm:p-4 animate-zoom-in duration-${categoryIndex % 2 === 0 ? 'normal' : 'light-slow'}`}>
            {/* Category Header with Edit/Delete */}
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 mb-3 sm:mb-4">
              {editingCategoryIndex === categoryIndex ? (
                <div className="flex items-center gap-2 flex-1">
                  <TextField
                    value={editingCategoryName}
                    onChange={(e) => setEditingCategoryName(e.target.value)}
                    size="small"
                    placeholder="Nome da categoria"
                    sx={{ flex: 1 }}
                    autoFocus
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        updateCategoryName(categoryIndex);
                      } else if (e.key === 'Escape') {
                        cancelEditingCategory();
                      }
                    }}
                  />
                  <IconButton
                    onClick={() => updateCategoryName(categoryIndex)}
                    size="small"
                    color="primary"
                    title="Salvar"
                  >
                    <CheckIcon fontSize="small" />
                  </IconButton>
                  <IconButton
                    onClick={cancelEditingCategory}
                    size="small"
                    title="Cancelar"
                  >
                    <CloseIcon fontSize="small" />
                  </IconButton>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <CategoryIcon fontSize="small" className="text-gray-500" />
                  <h3 className="text-sm sm:text-md font-semibold text-gray-900 animate-fade-right duration-very-fast">
                    {category.category}
                  </h3>
                  <IconButton
                    onClick={() => startEditingCategory(categoryIndex)}
                    size="small"
                    title="Editar nome da categoria"
                  >
                    <EditIcon fontSize="small" />
                  </IconButton>
                </div>
              )}
              <Button
                onClick={() => removeCategory(categoryIndex)}
                variant="outlined"
                color="error"
                size="small"
                startIcon={<DeleteIcon />}
              >
                Remover Categoria
              </Button>
            </div>

            <div className="space-y-3">
              {category.items.map((item, itemIndex) => (
                <div key={itemIndex} className="border border-gray-100 rounded-sm p-3 animate-fade-up" style={{ animationDuration: `${400 + (itemIndex % 3) * 200}ms` }}>
                  {/* First Row: Name and Price */}
                  <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 mb-2">
                    <TextField
                      value={item.name}
                      onChange={(e) => updateItem(categoryIndex, itemIndex, 'name', e.target.value)}
                      placeholder="Nome do item"
                      size="small"
                      sx={{ flex: 1 }}
                      fullWidth
                      label="Nome"
                    />
                    <TextField
                      type="number"
                      value={item.price}
                      onChange={(e) => updateItem(categoryIndex, itemIndex, 'price', parseFloat(e.target.value) || 0)}
                      placeholder="0.00"
                      size="small"
                      label="Preço"
                      sx={{ width: { xs: '100%', sm: '120px' } }}
                      slotProps={{
                        input: {
                          startAdornment: <span className="mr-1">R$</span>,
                          inputProps: { step: '0.01', min: 0 }
                        }
                      }}
                    />
                  </div>

                  {/* Second Row: Clothing-specific fields (only for clothing stores) */}
                  {isClothingStore && (
                    <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 mb-2">
                      <TextField
                        value={item.size || ''}
                        onChange={(e) => updateItem(categoryIndex, itemIndex, 'size', e.target.value)}
                        placeholder="Tamanho (ex: M, 38, 40)"
                        size="small"
                        label="Tamanho"
                        sx={{ flex: 1 }}
                        fullWidth
                        helperText="Use letras (PP, P, M, G) ou números (36, 38, 40)"
                      />
                      <TextField
                        value={item.color || ''}
                        onChange={(e) => updateItem(categoryIndex, itemIndex, 'color', e.target.value)}
                        placeholder="Cor"
                        size="small"
                        label="Cor"
                        sx={{ flex: 1 }}
                        fullWidth
                      />
                      <TextField
                        select
                        value={item.gender || ''}
                        onChange={(e) => updateItem(categoryIndex, itemIndex, 'gender', e.target.value)}
                        placeholder="Gênero"
                        size="small"
                        label="Gênero"
                        sx={{ flex: 1 }}
                        fullWidth
                      >
                        <MenuItem value="">Unissex</MenuItem>
                        <MenuItem value="masculino">Masculino</MenuItem>
                        <MenuItem value="feminino">Feminino</MenuItem>
                      </TextField>
                    </div>
                  )}

                  {/* Third Row: Remove Button */}
                  <div className="flex justify-end">
                    <Button
                      onClick={() => removeItem(categoryIndex, itemIndex)}
                      variant="outlined"
                      color="error"
                      size="small"
                      startIcon={<DeleteIcon />}
                      sx={{ minWidth: '120px' }}
                    >
                      Remover
                    </Button>
                  </div>
                </div>
              ))}
            </div>

            <Button
              onClick={() => addItem(categoryIndex)}
              variant="text"
              startIcon={<AddIcon />}
              sx={{ mt: 2 }}
              className="animate-fade-right duration-slow"
            >
              Adicionar Item
            </Button>
          </div>
        ))}
      </div>

      {catalog.length === 0 && (
        <div className="text-center py-8 sm:py-12 text-sm sm:text-base text-gray-500 animate-fade-up duration-normal">
          Nenhuma categoria cadastrada. Adicione uma categoria abaixo.
        </div>
      )}

      {/* Add New Category Section */}
      <div className="mt-6 sm:mt-8 p-3 sm:p-4 border-2 border-dashed border-gray-300 rounded-sm animate-fade-up duration-slow">
        <h3 className="text-sm font-medium text-gray-700 mb-3">
          Adicionar Nova Categoria
        </h3>
        <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
          <TextField
            value={newCategoryName}
            onChange={(e) => setNewCategoryName(e.target.value)}
            placeholder={isClothingStore ? 'Ex: Camisetas, Calças, Vestidos' : 'Ex: Hambúrgueres, Pizzas, Bebidas'}
            size="small"
            fullWidth
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                addCategory();
              }
            }}
          />
          <Button
            onClick={addCategory}
            variant="contained"
            startIcon={<AddIcon />}
            disabled={!newCategoryName.trim()}
            sx={{ minWidth: { sm: '180px' } }}
          >
            Adicionar
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CatalogEditor;
