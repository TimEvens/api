package org.openbmp.api.service;

import org.openbmp.api.dao.WithdrawmDao;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;


@Service("WithdrawnServiceImpl")
@Transactional
public class WithdrawnServiceImpl implements WithdrawnService {

    @Autowired
    WithdrawmDao withdrawnDao;


}
