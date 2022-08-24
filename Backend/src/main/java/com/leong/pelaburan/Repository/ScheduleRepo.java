package com.leong.pelaburan.Repository;


import java.util.List;

import javax.transaction.Transactional;

import com.leong.pelaburan.entity.Schedule;

@Transactional
public interface ScheduleRepo extends CustomizedRepo<Schedule, Long> {
    long deleteByschedulesToFd(long id);
    List<Schedule> findBySchedulesToFd(Long schedulesToFd);

}