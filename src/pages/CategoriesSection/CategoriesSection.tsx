import { useState, useEffect } from 'react'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import Icon from '@/components/ui/Icon'
import Table from '@/components/Table'
import Dialog from '@/components/Dialog'
import Snackbar from '@/components/Snackbar'
import style from './CategoriesSection.module.scss'
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
    <div className={style.categoriesSection}>
      <Button type="primary" className={style.addButton} onClick={() => handleOpenDialog(null)}>
        Добавить категорию
      </Button>

      <Table
        headers={['ID', 'Название', 'Действия']}
        loading={loading}
        emptyText="Нет категорий"
        data={categories}
        renderRow={(category: Category) => [
          category.id,
          category.name,
          <div className={style.actions}>
            <Button
              type="text"
              className={style.actionButton}
              onClick={() => handleOpenDialog(category)}
            >
              <Icon icon="edit" />
            </Button>
            <Button
              type="text"
              className={style.actionButton}
              onClick={() => handleDelete(category.id)}
            >
              <Icon icon="delete" />
            </Button>
          </div>
        ]}
      />

      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        title={currentCategory ? 'Редактировать категорию' : 'Создать категорию'}
        actions={
          <>
            <Button type="text" onClick={handleCloseDialog}>
              Отмена
            </Button>
            <Button type="primary" onClick={handleSubmit}>
              Сохранить
            </Button>
          </>
        }
      >
        <Input
          type="text"
          placeholder="Название категории"
          value={categoryName}
          onChange={(e) => setCategoryName(e.target.value)}
          className={style.input}
        />
      </Dialog>

      <Snackbar
        open={snackbar.open}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        severity={snackbar.severity}
        message={snackbar.message}
      />
    </div>
  )
}

export default CategoriesSection
