package jvbz.boot.vss.inquiry.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import jvbz.boot.vss.inquiry.entity.Inquiry;

public interface InquiryRepository extends JpaRepository<Inquiry, Integer> {
	void deleteByUserId(String userId);
}
