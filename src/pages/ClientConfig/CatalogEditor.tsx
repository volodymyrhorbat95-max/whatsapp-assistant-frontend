// Catalog Editor - Edit menu items and prices for delivery clients

import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../../store';
import { updateClient } from '../../store/slices/clientSlice';
import { Client, CatalogCategory, CatalogItem } from '../../types';
import { Button, TextField } from '@mui/material';
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

  const handleSave = async () => {
    const updatedConfiguration = {
      ...client.configuration,
      catalog
    };

    await dispatch(updateClient({
      clientId: client.id,
      configuration: updatedConfiguration
    }));

    setHasChanges(false);
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
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-lg font-semibold text-gray-900">
          Cardápio
        </h2>
        {hasChanges && (
          <Button
            onClick={handleSave}
            variant="contained"
          >
            Salvar Alterações
          </Button>
        )}
      </div>

      <div className="space-y-8">
        {catalog.map((category, categoryIndex) => (
          <div key={categoryIndex} className="border border-gray-200 rounded-lg p-4">
            <h3 className="text-md font-semibold text-gray-900 mb-4">
              {category.category}
            </h3>

            <div className="space-y-3">
              {category.items.map((item, itemIndex) => (
                <div key={itemIndex} className="flex gap-3 items-start">
                  <TextField
                    value={item.name}
                    onChange={(e) => updateItem(categoryIndex, itemIndex, 'name', e.target.value)}
                    placeholder="Nome do item"
                    size="small"
                    sx={{ flex: 1 }}
                  />
                  <TextField
                    type="number"
                    value={item.price}
                    onChange={(e) => updateItem(categoryIndex, itemIndex, 'price', parseFloat(e.target.value) || 0)}
                    placeholder="0.00"
                    size="small"
                    sx={{ width: '120px' }}
                    slotProps={{
                      input: {
                        startAdornment: <span className="mr-1">R$</span>,
                        inputProps: { step: '0.01', min: 0 }
                      }
                    }}
                  />
                  <Button
                    onClick={() => removeItem(categoryIndex, itemIndex)}
                    variant="outlined"
                    color="error"
                    size="small"
                    startIcon={<DeleteIcon />}
                  >
                    Remover
                  </Button>
                </div>
              ))}
            </div>

            <Button
              onClick={() => addItem(categoryIndex)}
              variant="text"
              startIcon={<AddIcon />}
              sx={{ mt: 2 }}
            >
              Adicionar Item
            </Button>
          </div>
        ))}
      </div>

      {catalog.length === 0 && (
        <div className="text-center py-12 text-gray-500">
          Nenhuma categoria cadastrada
        </div>
      )}
    </div>
  );
};

export default CatalogEditor;
