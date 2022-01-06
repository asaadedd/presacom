import { OutletDto, OrderEntry, OrderStatuses } from '@presacom/models';
import { useEffect } from 'react';
import { Form } from 'react-bootstrap';
import { productHeaders } from '../../../shared/models/products';
import CreateOrder from '../../../shared/presentations/CreateOrder';
import DashboardWidget from '../../../shared/presentations/DashboardWidget';
import TableDisplay from '../../../shared/presentations/TableDisplay';
import { useAppSelector, useAppDispatch } from '../../../store';
import { selectOutlets } from '../../outlet/store/outlet';
import { getDistributorProfit } from '../store/distributor';
import { placeDistributorOrder, getDistributorOrders } from '../store/distributorOrders';
import { selectDistributorProducts, getDistributorProducts } from '../store/distributorProducts';

function DistributorStock() {
  const products = useAppSelector(selectDistributorProducts);
  const outlets: OutletDto[] = useAppSelector(selectOutlets);
  const dispatch = useAppDispatch();

  const onOrderSubmit = async (entries: OrderEntry[], formData: any) => {
    await dispatch(placeDistributorOrder({
      outletId: formData.outletId,
      status: OrderStatuses.DELIVERED,
      entries,
      price: entries.reduce((price, entry) => {
        price += (entry.unitPrice * entry.quantity) ;

        return price;
      }, 0)
    }));
    dispatch(getDistributorOrders());
    dispatch(getDistributorProducts());
    dispatch(getDistributorProfit());
  }

  useEffect(() => {
    dispatch(getDistributorProducts());
    dispatch(getDistributorProfit());
  }, [dispatch])

  return (
    <DashboardWidget 
      title={<span className="fs-5 fw-bold">Stock</span>}
      actions={
        <CreateOrder 
          buttonText="Distribuie marfa"
          products={products}
          onSubmit={onOrderSubmit} 
          getAdditionalControls={(register, errors) => (
            <div className="mb-3">
              <label htmlFor="name" className="form-label">Distribuitorul</label>
              <Form.Select
                aria-label="Selectati perioada"
                {...register('outletId')}
              >
                {
                  outlets.map((outlet, i) => <option value={outlet._id} key={outlet._id}>{outlet.name}</option>)
                }
              </Form.Select>
              {errors['outletId'] && <div className="invalid-feedback">{errors['outletId'].message}</div>}
            </div>
          )}
        />
      }>
      <TableDisplay useCheckboxes={false} data={products} headers={productHeaders} />
    </DashboardWidget>
  )
}

export default DistributorStock;