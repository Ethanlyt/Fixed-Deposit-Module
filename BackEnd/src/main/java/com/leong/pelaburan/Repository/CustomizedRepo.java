package com.leong.pelaburan.Repository;

import java.io.Serializable;
import java.util.Optional;

import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.NoRepositoryBean;

@NoRepositoryBean

public interface CustomizedRepo <T,ID extends Serializable> 
    extends CrudRepository<T,ID> {
        default T findOne(ID id){
            Optional<T> obj = this.findById(id);
            if(obj.isPresent()){
                return obj.get();
            }
            else {
                return null;
            }
        }
    
}
