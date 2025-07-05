import { useState, useEffect } from 'react'
import {
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  CircularProgress,
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  DialogActions,
  Snackbar,
  Alert,
} from '@mui/material'
import { AdminService } from '@/api/hooks'
import { Category } from '@/types'

const CategoriesSection = () => {
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [openDialog, setOpenDialog] = useState(false)
  const [currentCategory, setCurrentCategory] = useState<Category | null>(null)
  const [categoryName, setCategoryName] = useState('')
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success' as 'success' | 'error',
  })

  useEffect(() => {
    fetchCategories()
  }, [])

  const fetchCategories = async () => {
    setLoading(true)
    try {
      const categoriesData = await AdminService.getCategories()
      setCategories(categoriesData)
    } catch (error: any) {
      const message = error.message || 'Ошибка при загрузке категорий'
      setSnackbar({
        open: true,
        message,
        severity: 'error',
      })
    } finally {
      setLoading(false)
    }
  }

  const handleOpenDialog = (category: Category | null) => {
    setCurrentCategory(category)
    setCategoryName(category ? category.name : '')
    setOpenDialog(true)
  }

  const handleCloseDialog = () => {
    setOpenDialog(false)
    setCurrentCategory(null)
    setCategoryName('')
  }

  const handleSubmit = async () => {
    if (!categoryName.trim()) {
      setSnackbar({
        open: true,
        message: 'Название категории не может быть пустым',
        severity: 'error',
      })
      return
    }

    try {
      if (currentCategory) {
        await AdminService.updateCategory(currentCategory.id, {
          name: categoryName,
        })
        setSnackbar({
          open: true,
          message: 'Категория успешно обновлена',
          severity: 'success',
        })
      } else {
        await AdminService.createCategory({ name: categoryName })
        setSnackbar({
          open: true,
          message: 'Категория успешно создана',
          severity: 'success',
        })
      }
      fetchCategories()
      handleCloseDialog()
    } catch (error: any) {
      const message = error.message || 'Ошибка при сохранении категории'
      setSnackbar({
        open: true,
        message,
        severity: 'error',
      })
    }
  }

  const handleDelete = async (id: number) => {
    try {
      await AdminService.deleteCategory(id)
      setSnackbar({
        open: true,
        message: 'Категория успешно удалена',
        severity: 'success',
      })
      fetchCategories()
    } catch (error: any) {
      const message = error.message || 'Ошибка при удалении категории'
      setSnackbar({
        open: true,
        message,
        severity: 'error',
      })
    }
  }

  return (
    <Box>
      <Button
        variant="contained"
        onClick={() => handleOpenDialog(null)}
        sx={{ mb: 3 }}
      >
        Добавить категорию
      </Button>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Название</TableCell>
              <TableCell align="right">Действия</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={3} align="center">
                  <CircularProgress />
                </TableCell>
              </TableRow>
            ) : categories.length === 0 ? (
              <TableRow>
                <TableCell colSpan={3} align="center">
                  Нет категорий
                </TableCell>
              </TableRow>
            ) : (
              categories.map((category) => (
                <TableRow key={category.id}>
                  <TableCell>{category.id}</TableCell>
                  <TableCell>{category.name}</TableCell>
                  <TableCell align="right">
                    <IconButton
                      onClick={() => handleOpenDialog(category)}
                      aria-label="edit"
                    ></IconButton>
                    <IconButton
                      onClick={() => handleDelete(category.id)}
                      aria-label="delete"
                    ></IconButton>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>
          {currentCategory ? 'Редактировать категорию' : 'Создать категорию'}
        </DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Название категории"
            fullWidth
            variant="standard"
            value={categoryName}
            onChange={(e) => setCategoryName(e.target.value)}
            sx={{ mt: 2 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Отмена</Button>
          <Button onClick={handleSubmit} variant="contained">
            Сохранить
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  )
}

export default CategoriesSection
