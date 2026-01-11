// Catalog Editor - Edit menu items and prices for all client types

import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../../store';
import { updateClient } from '../../store/slices/clientSlice';
import { Client, CatalogCategory, CatalogItem } from '../../types';
import { Button, TextField, MenuItem, Alert } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';

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

  // Check if this is a clothing store to show size/color/gender fields
  const isClothingStore = client.segment === 'clothing';

  const handleSave = async () => {
    setError(null);
    setSuccess(null);

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
    const newCatalog = [...catalog];
    newCatalog[categoryIndex].items.push({
      name: '',
      price: 0
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
    const newCatalog = [...catalog];
    newCatalog[categoryIndex].items[itemIndex][field] = value as never;
    setCatalog(newCatalog);
    setHasChanges(true);
  };

  const removeItem = (categoryIndex: number, itemIndex: number) => {
    const newCatalog = [...catalog];
    newCatalog[categoryIndex].items.splice(itemIndex, 1);
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
            <h3 className="text-sm sm:text-md font-semibold text-gray-900 mb-3 sm:mb-4 animate-fade-right duration-very-fast">
              {category.category}
            </h3>

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
                        select
                        value={item.size || ''}
                        onChange={(e) => updateItem(categoryIndex, itemIndex, 'size', e.target.value)}
                        placeholder="Tamanho"
                        size="small"
                        label="Tamanho"
                        sx={{ flex: 1 }}
                        fullWidth
                      >
                        <MenuItem value="">Nenhum</MenuItem>
                        <MenuItem value="PP">PP</MenuItem>
                        <MenuItem value="P">P</MenuItem>
                        <MenuItem value="M">M</MenuItem>
                        <MenuItem value="G">G</MenuItem>
                        <MenuItem value="GG">GG</MenuItem>
                        <MenuItem value="XG">XG</MenuItem>
                      </TextField>
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
          Nenhuma categoria cadastrada
        </div>
      )}
    </div>
  );
};

export default CatalogEditor;
